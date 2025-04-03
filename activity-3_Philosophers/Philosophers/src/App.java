import java.util.Random;

public class App {
    /*
     * 
            As written, all philosophers are right handed.
            np is the number of philosophers (and forks); if omitted the default is 4.
            nt is the number of the think / eat cycles; the default is 10.
            tm is the think time in milliseconds; the default is 0.
            em is the eat time in milliseconds; the default is 0.
            Command line arguments will be provided in the order shown above. Trailing arguments that are not specified will receive the default value.

     */
    public static void main(String[] args) throws Exception {

        int np = 4; // number of philosophers
        int nt = 10; // number of think/eat cycles
        long tm = 0; // think time in milliseconds
        long em = 0; // eat time in milliseconds

        if (args.length > 0) np = Integer.parseInt(args[0]);
        if (args.length > 1) nt = Integer.parseInt(args[1]);
        if (args.length > 2) tm = Long.parseLong(args[2]);
        if (args.length > 3) em = Long.parseLong(args[3]);
        

        Fork[] forks = new Fork[np];
        for (int i = 0; i < np; i++) {
            forks[i] = new Fork();
        }

        Philosopher[] philosophers = new Philosopher[np];
        for (int i = 0; i < np; i++) {
            philosophers[i] = new Philosopher(i, forks[i], forks[(i + 1) % np], nt, tm, em);
            new Thread(philosophers[i]).start();
        }

    }
}
