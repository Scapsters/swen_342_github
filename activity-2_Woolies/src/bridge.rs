use crate::woolie::Woolie;
use std::{
    collections::VecDeque,
    sync::{Arc, Condvar, Mutex}, thread::JoinHandle,
};

pub struct Bridge {
    capacity: usize, // Maximum number of threads allowed on the bridge
    state: Arc<(Mutex<BridgeState>, Condvar)>, // Shared state with a condition variable
}

struct BridgeState {
    active_count: usize,         // Number of threads currently on the bridge
    queue: VecDeque<Arc<Woolie>>, // Queue of waiting Woolies
}

impl Bridge {
    pub fn new(capacity: usize) -> Bridge {
        Bridge {
            capacity,
            state: Arc::new((
                Mutex::new(BridgeState {
                    active_count: 0,
                    queue: VecDeque::new(),
                }),
                Condvar::new(),
            )),
        }
    }

    pub fn request_key(&self, woolie: Woolie) -> JoinHandle<()> {
        println!(
            "Woolie has arrived at bridge. Destination: {}",
            woolie.destination.to_string()
        );
        
        let woolie = Arc::new(woolie); // Wrap Woolie in Arc for shared ownership
        let (lock, condvar) = &*self.state;
        let mut state = lock.lock().unwrap();
        
        state.queue.push_back(woolie.clone());

        // Wait until the Woolie is at the front of the queue and there's capacity
        while state.active_count >= self.capacity || state.queue.front().unwrap() != &woolie {
            state = condvar.wait(state).unwrap();
        }

        state.queue.pop_front();
        state.active_count += 1;

        // Spawn a thread for the Woolie
        let state_clone = Arc::clone(&self.state);
        return std::thread::spawn(move || {
            woolie.cross_bridge();

            // Notify the bridge when the Woolie is done
            let (lock, condvar) = &*state_clone;
            let mut state = lock.lock().unwrap();
            state.active_count -= 1;
            condvar.notify_all();
            println!(
                "Woolie {} has arrived at {}",
                woolie.name, woolie.destination.to_string()
            );
        });
    }
}