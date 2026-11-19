import { Bolt, Cable, Fan, Lightbulb, Plug, Sun } from "lucide-react";

export const categories = [
  { name: "Hardware", icon: Bolt },
  { name: "Fans", icon: Fan },
  { name: "Bulbs", icon: Lightbulb },
  { name: "Lighting", icon: Sun },
  { name: "Wires & Cables", icon: Cable },
  { name: "Switches & Sockets", icon: Plug },
];

export const products = [
  { id: "screws", name: "Phillips Head Wood Screws", category: "Hardware", detail: "Zinc plated · 50-piece pack", price: 149 },
  { id: "fan", name: "3-Blade Ceiling Fan", category: "Fans", detail: "1200 mm sweep · Matte white", price: 2199 },
  { id: "bulb", name: "LED Bulb", category: "Bulbs", detail: "9 W · Cool white · B22 base", price: 99 },
  { id: "panel", name: "Round LED Panel Light", category: "Lighting", detail: "12 W · Recessed mount", price: 349 },
  { id: "wire", name: "Insulated Copper Wire", category: "Wires & Cables", detail: "1.5 mm² · 90 m coil · Red", price: 1699 },
  { id: "socket", name: "Modular Switch & Socket", category: "Switches & Sockets", detail: "6 A · 3-pin socket · White", price: 279 },
];

export const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
});

export type Quote = Partial<Record<string, number>>;

export function readQuote(): Quote {
  try {
    const data = JSON.parse(localStorage.getItem("volt-bolt-quote") ?? "{}");
    return Object.fromEntries(products.flatMap(({ id }) => {
      const count = data?.[id];
      return Number.isSafeInteger(count) && count >= 1 && count <= 999 ? [[id, count]] : [];
    }));
  } catch {
    return {};
  }
}
