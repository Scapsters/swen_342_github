public class Fork implements IFork {
    private boolean isAvailable = true;

    public synchronized void acquire() {
        while (!isAvailable) {
            try {
                wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        isAvailable = false;
    }

    public synchronized void release() {
        isAvailable = true;
        notifyAll();
    }
}

abstract interface IFork {
    public void acquire();
    public void release();
}