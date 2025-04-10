package com.example;

public class Main {
    public static void main(String[] args) {
        SharedQueue sharedQueue = new SharedQueue(10);
        for(int i = 0; i < 2; i++) {
            
            Thread producerThread = new Thread(new Producer(sharedQueue));
            Thread consumerThread = new Thread(new Consumer(sharedQueue));

            producerThread.start();
            consumerThread.start();
        }
    }
}