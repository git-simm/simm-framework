package simm.framework.test.entity;

import lombok.Data;

@Data
public class Car {
    private double price;
    private String colour;
    public Car(double price, String colour){
        this.price = price;
        this.colour = colour;
    }
    public String toString(){
        return colour +"car costs $"+price;
    }
}
