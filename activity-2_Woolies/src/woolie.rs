use std::thread;

use crate::city::City;

#[derive(Clone)]
pub struct Woolie {
    name: String,
    time: u32,
    destination: City,
}

impl Woolie {
    pub fn new(name: String, time: u32, destination: City) -> Woolie {
        Woolie {
            name,
            time,
            destination,
        }
    }

    pub fn run(&self) {
        println!(
            "Woolie has arrived at bridge. Destination: {}",
            self.destination.to_string()
        );
        thread::sleep(std::time::Duration::from_secs(1));
        self.cross_bridge();
        println!(
            "Woolie {} has arrived at {}",
            self.name, self.destination.to_string()
        );
    }

    pub fn cross_bridge(&self) {
        println!(
            "Woolie {} is starting to cross the bridge for {} seconds",
            self.name, self.time
        );
        for i in 0..=self.time {
            thread::sleep(std::time::Duration::from_secs(1));
            println!("Woolie {} is {} seconds in", self.name, i);
        }
    }
}
