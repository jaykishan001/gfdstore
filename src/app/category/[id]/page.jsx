import Container from "@/components/Container";
import HeaderCategoryOptions from "@/components/HeaderCategoryOptions";
import { ProductCard } from "@/components/ProductCard";
import React from "react";

const CategoryPage = async ({ params }) => {
  const category = await params?.id; // ✅ Await params.id
  console.log(category);

  const products = [
    { id: "1", name: "Product 1", price: 19.99, imageUrl: "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "2", name: "Product 2", price: 29.99, imageUrl: "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "3", name: "Product 3", price: 39.99, imageUrl: "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "4", name: "Product 4", price: 49.99, imageUrl: "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "5", name: "Product 5", price: 59.99, imageUrl: "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];

  return (
    <Container className="pt-24">
      <HeaderCategoryOptions />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        <p className="text-xl text-gray-700 mb-4">Category: {category}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </main>
    </Container>
  );
};

export default CategoryPage;
