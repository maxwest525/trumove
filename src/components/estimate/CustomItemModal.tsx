import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Package } from "lucide-react";

interface CustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    name: string;
    room: string;
    weight: number;
    cubicFeet: number;
    quantity: number;
    fragile: boolean;
  }) => void;
  defaultRoom: string;
}

const ROOM_OPTIONS = [
  "Living Room",
  "Master Bedroom",
  "Bedroom",
  "Kitchen",
  "Dining Room",
  "Home Office",
  "Bathroom",
  "Garage",
  "Outdoor",
  "Other",
];

export function CustomItemModal({
  isOpen,
  onClose,
  onAdd,
  defaultRoom,
}: CustomItemModalProps) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState(defaultRoom || "Living Room");
  const [weight, setWeight] = useState(50);
  const [cubicFeet, setCubicFeet] = useState(5);
  const [quantity, setQuantity] = useState(1);
  const [fragile, setFragile] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      room,
      weight,
      cubicFeet,
      quantity,
      fragile,
    });

    // Reset form
    setName("");
    setWeight(50);
    setCubicFeet(5);
    setQuantity(1);
    setFragile(false);
    onClose();
  };

  const handleClose = () => {
    setName("");
    setWeight(50);
    setCubicFeet(5);
    setQuantity(1);
    setFragile(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Add Custom Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name *</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 60))}
              placeholder="e.g., Antique Grandfather Clock"
              className="tru-wizard-input"
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-right">
              {name.length}/60
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-room">Room</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger id="item-room">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOM_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-weight">Weight (lbs)</Label>
              <Input
                id="item-weight"
                type="number"
                min={1}
                max={2000}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value) || 1)}
                className="tru-wizard-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-size">Size (cu.ft)</Label>
              <Input
                id="item-size"
                type="number"
                min={1}
                max={500}
                value={cubicFeet}
                onChange={(e) => setCubicFeet(Number(e.target.value) || 1)}
                className="tru-wizard-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-bold text-lg">
                {quantity}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="item-fragile">Fragile Item</Label>
              <p className="text-xs text-muted-foreground">
                Requires extra care during move
              </p>
            </div>
            <Switch
              id="item-fragile"
              checked={fragile}
              onCheckedChange={setFragile}
            />
          </div>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
