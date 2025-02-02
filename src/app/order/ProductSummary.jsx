export const ProductSummary = ({ products }) => (
  <div className="space-y-4">
    {products.map((product) => (
      <div key={product._id} className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-16 w-16 rounded-md object-cover"
          />
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              Quantity: {product.quantity}
            </p>
          </div>
        </div>
        <p className="font-medium">
          ${(product.price * product.quantity).toFixed(2)}
        </p>
      </div>
    ))}
  </div>
);
