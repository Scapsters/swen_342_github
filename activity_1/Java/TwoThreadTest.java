package java;

public class TwoThreadTest {
    public static void main(String[] args) {
        SimpleThread hiThread = new SimpleThread("hi");
        SimpleThread hoThread = new SimpleThread("ho");
        hiThread.start();
        hoThread.start();
    }
}
