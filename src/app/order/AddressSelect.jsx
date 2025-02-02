export const AddressSelect = ({ addresses, value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="address">Shipping Address</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id="address" className="w-full">
        <SelectValue placeholder="Select an address" />
      </SelectTrigger>
      <SelectContent>
        {addresses.map((address) => (
          <SelectItem key={address._id} value={address._id}>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span>
                {address.street}, {address.city}, {address.state}{" "}
                {address.postalCode}, {address.country}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
