use serde_json;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {

    let new_todo: serde_json::Value = reqwest::Client::new()
        .get("http://api.open-notify.org/astros.json")
        .send()
        .await?
        .json()
        .await?;

    println!("JSON raw response: {:#?}", new_todo);
    println!("{:#?}", new_todo["message"]);
    println!("{:#?}", new_todo["number"]);
    println!("{:#?}", new_todo["people"][0]["name"]);
    println!("{:#?}", new_todo["people"][1]["name"]);

    Ok(())
}