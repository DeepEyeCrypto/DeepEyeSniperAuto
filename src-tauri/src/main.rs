use tauri::Emitter;
use futures_util::{StreamExt, SinkExt};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};
use url::Url;
use std::time::Duration;
use serde_json::json;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_websocket::init())
        .setup(|app| {
            let app_handle = app.handle().clone();

            // Spawn the Zero-Latency Engine
            tauri::async_runtime::spawn(async move {
                loop {
                    println!("[RUST_CORE] Connecting to Hyperliquid...");
                    let url = Url::parse("wss://api.hyperliquid.xyz/ws").unwrap();
                    
                    match connect_async(url).await {
                        Ok((ws_stream, _)) => {
                            println!("[RUST_CORE] Connected. Subscribing to allMids...");
                            let (mut write, mut read) = ws_stream.split();

                            // Subscribe
                            let subscribe_msg = json!({
                                "method": "subscribe",
                                "subscription": { "type": "allMids" }
                            });
                            if let Err(e) = write.send(Message::Text(subscribe_msg.to_string())).await {
                                eprintln!("[RUST_CORE] Subscription failed: {}", e);
                                tokio::time::sleep(Duration::from_secs(2)).await;
                                continue;
                            }

                            // Stream Loop
                            while let Some(msg) = read.next().await {
                                match msg {
                                    Ok(Message::Text(text)) => {
                                        // Optimize: Only parse what we need (SOL price)
                                        if let Ok(v) = serde_json::from_str::<serde_json::Value>(&text) {
                                            if let Some(channel) = v.get("channel") {
                                                if channel == "allMids" {
                                                    if let Some(mids) = v.get("data").and_then(|d| d.get("mids")) {
                                                        if let Some(sol_price) = mids.get("SOL") {
                                                            let price_str = sol_price.as_str().unwrap_or("0");
                                                            let price: f64 = price_str.parse().unwrap_or(0.0);
                                                            
                                                            // Zero-Latency Emit
                                                            let _ = app_handle.emit("price_update", json!({ "symbol": "SOL", "price": price }));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    Ok(Message::Close(_)) => break, // Reconnect
                                    Err(_) => break, // Reconnect
                                    _ => {}
                                }
                            }
                        }
                        Err(e) => {
                            eprintln!("[RUST_CORE] Connection failed: {}", e);
                        }
                    }
                    
                    // Reconnect delay
                    tokio::time::sleep(Duration::from_secs(2)).await;
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
