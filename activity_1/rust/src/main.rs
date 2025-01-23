fn main() {
   let (tx, rx) = mpsc::channel();

   thread::spawn(move || {
        tx.send("hi from spawned thread").unwrap();
   })
}
