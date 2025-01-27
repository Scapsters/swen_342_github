use core::time;
use rand::random;
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel::<String>();

    let threads: Vec<_> = (1..4)
        .map(|i| build_thread(format!("Thread {}", i), tx.clone(), 10))
        .collect();

    let _receiver_thread = thread::spawn(move || {
        for received in rx {
            println!("Received: {}", received);
        }
    });

    threads.iter().for_each(|handle| handle.join().unwrap());
}

fn build_thread(name: String, tx: mpsc::Sender<String>, n: u8) -> thread::JoinHandle<()> {
    thread::Builder
        ::new()
        .name(name)
        .spawn(move || {
            let tx1 = tx.clone();
            count_to(n, tx1);
            tx.send(format!("{} finished", thread::current().name().unwrap())).unwrap();
        })
        .expect("Failed to create thread")
}

fn count_to(n: u8, tx: mpsc::Sender<String>) {
    let send_message = |message: String| {
        tx.send(message).unwrap();
    };

    for i in 1..=n {
        send_message(format!("{} sent from {}", i, thread::current().name().unwrap()));
        wait_random_time();
    }
}

fn wait_random_time() {
    let random_value = random::<f32>();
    let random_time = time::Duration::from_millis((random_value * 1000.0) as u64);
    thread::sleep(random_time);
}
