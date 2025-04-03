import java.util.Random;

public class Philosopher implements Runnable {
    private static Random random = new Random();

    private int id;
    private Fork left;
    private Fork right;
    private int nTimes;
    private long thinkMillis;
    private long eatMillis;

    public Philosopher(int id, Fork left, Fork right, int nTimes, long thinkMillis, long eatMillis) {
        this.id = id;
        this.left = left;
        this.right = right;
        this.nTimes = nTimes;
        this.thinkMillis = thinkMillis;
        this.eatMillis = eatMillis;
    }
    
    public void run() {
        int iterations = nTimes == 0 ? Integer.MAX_VALUE : nTimes; // Replace with i-- in for loop block for true infinite loop
        for(int i = 0; i < iterations; i++) {
            long thinkTime = thinkMillis == 0 ? 0 : random.nextLong(thinkMillis);
            System.out.println("Philosopher " + id + " is thinking for " + thinkTime + " milliseconds.");
            try {
                Thread.sleep(thinkTime);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.out.println("Philosopher " + id + " goes for the right fork.");
            right.acquire();
            System.out.println("Philosopher " + id + " has the right fork.");
            Thread.yield();
            System.out.println("Philosopher " + id + " goes for the left fork.");
            left.acquire();
            System.out.println("Philosopher " + id + " has the left fork.");
            long eatTime = eatMillis == 0 ? 0 : random.nextLong(eatMillis);
            System.out.println("Philosopher " + id + " eats for " + eatTime + " milliseconds.");
            try {
                Thread.sleep(eatTime);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            right.release();
            System.out.println("Philosopher " + id + " releases the right fork.");
            left.release();
            System.out.println("Philosopher " + id + " releases the left fork.");
        }
    }
}