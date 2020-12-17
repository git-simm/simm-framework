package simm.framework.test.thread;

import java.io.IOException;
import java.io.PipedReader;
import java.io.PipedWriter;

public class Piped {
    public static void main(String[] args) throws Exception{
        PipedWriter out = new PipedWriter();
        PipedReader in = new PipedReader();
        out.connect(in);
        Thread printThread = new Thread(new Print(in),"PrintThread");
        printThread.start();
        int receive = 0;
        try{
            while((receive = System.in.read())!=-1){
                out.write(receive);
            }
        }finally {
            out.close();
        }
    }
    static class Print implements Runnable{
        private PipedReader in;
        public Print(PipedReader in){
            this.in = in;
        }
        public void run(){
            int reveive = 0;
            try {
                while((reveive = in.read())!= -1){
                    System.out.print((char)reveive);
                }
            }catch (IOException ex){

            }
        }
    }
}
