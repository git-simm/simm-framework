package simm.framework.test;

import simm.framework.test.entity.Car;

import java.lang.ref.WeakReference;

/**
 * 引用测试
 */
public class ReferenceTest {
    /**
     * 弱类型指向，在GC线程执行时会被回收
     * @param args
     */
    public static void main(String[] args) {
        Car car = new Car(22000,"silver");
        WeakReference<Car> weakCar = new WeakReference<>(car);
        int i=0;
        // 在上例中, 程序运行一段时间后, 程序打印出"Object has been collected." 说明, weak reference指向的对象的被回收了.
        // 值得注意的一点, 即使有car引用指向对象, 且car是一个strong reference, weak reference weakCar指向的对象仍然被回收了.
        // 这是因为java的编译器在发现进入while循环之后, car已经没有被使用了, 所以进行了优化(将其置空?).
        while(true){
            if(weakCar.get()!=null){
                i++;
                System.out.println("Object is alive for "+i+" loops - "+weakCar);
            }else{
                System.out.println("Object has been collected.");
                break;
            }
        }
    }

    /**
     * 有一个强类型指向，则对象不会被GC回收
     * @param args
     */
    public static void main2(String[] args) {
        Car car = new Car(22000,"silver");
        WeakReference<Car> weakCar = new WeakReference<>(car);
        int i=0;

        while(true){
            //weak reference指向的object就不会被回收了. 因为还有一个strong reference car指向它
            System.out.println("here is the strong reference 'car' "+car);//use the strong reference in the while loop
            if(weakCar.get()!=null){
                i++;
                System.out.println("Object is alive for "+i+" loops - "+weakCar);
            }else{
                System.out.println("Object has been collected.");
                break;
            }
        }
    }
}
