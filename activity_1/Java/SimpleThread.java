package java;

import java.util.Random;

public class SimpleThread extends Thread {
    
    private Random random = new Random();
    private String stringToPrint;

    public SimpleThread(String stringToPrint) {
        this.stringToPrint = stringToPrint;
    }

    @Override
    public void run() {
        try {
            Thread.sleep(random.nextInt(1000));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            e.printStackTrace();
        }
        for(int i = 0; i < 10; i++) {
            System.out.println(stringToPrint);
            try {
                Thread.sleep(random.nextInt(1000));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                e.printStackTrace();
            }
        }
        System.out.println("Thread " + stringToPrint + " is done!");
    }
}