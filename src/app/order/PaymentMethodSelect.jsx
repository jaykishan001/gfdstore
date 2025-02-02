import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PAYMENT_METHODS } from "./OrderForm";

export const PaymentMethodSelect = ({ value, onChange }) => (
  <RadioGroup
    value={value}
    onValueChange={onChange}
    className="grid grid-cols-2 gap-4"
  >
    {PAYMENT_METHODS.map((method) => (
      <Label
        key={method.value}
        className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary ${
          value === method.value ? "border-primary" : ""
        }`}
      >
        <RadioGroupItem
          value={method.value}
          id={method.value}
          className="sr-only"
        />
        <method.icon className="mb-3 h-6 w-6" />
        {method.label}
      </Label>
    ))}
  </RadioGroup>
);
