package com.esgi.foodtracker.model;

import org.springframework.data.cassandra.core.mapping.*;

@Table("product_user_habit")
public class ProductUserHabitDTO {

    @Column
    @PrimaryKey
    private ProductUserKey puk;
    @Column
    private String product_name;
    @Column
    private String category;
    @Column
    private int quantity;
    @Column
    private String brand;
    @Column
    private int age;
    @Column
    private String sexe;

    public ProductUserHabitDTO() {
    }

    public ProductUserHabitDTO(ProductUserKey puk,
                               String product_name,
                               String category, String brand, int quantity,
                               int age, String sexe) {
        this.puk = puk;
        this.product_name = product_name;
        this.category = category;
        this.quantity = quantity;
        this.brand = brand;
        this.age = age;
        this.sexe = sexe;
    }

    public ProductUserKey getPuk() {
        return puk;
    }

    public void setPuk(ProductUserKey puk) {
        this.puk = puk;
    }

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    @Override
    public String toString() {
        return "ProductUserHabitDTO{" +
                "puk=" + puk +
                ", product_name='" + product_name + '\'' +
                ", category='" + category + '\'' +
                ", quantity=" + quantity +
                ", brand='" + brand + '\'' +
                ", age=" + age +
                ", sexe='" + sexe + '\'' +
                '}';
    }
}