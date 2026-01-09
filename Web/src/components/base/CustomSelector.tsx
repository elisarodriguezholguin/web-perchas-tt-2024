import { useState, useCallback, useEffect } from "react";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";

interface Props<T> {
  catalog: T[];
  propertyKey: keyof T;
  label: string;
  onSelect: (item: T) => void;
  defaultValue?: T;
  reset?: boolean; // Nuevo prop para manejar el reinicio
}

export function CustomSelector<T>({
  catalog,
  propertyKey,
  label,
  onSelect,
  defaultValue,
  reset = false, // Valor por defecto false
}: Props<T>) {
  // Usa defaultValue para el estado inicial si está disponible
  const initialSelectedValue = defaultValue
    ? String(defaultValue[propertyKey])
    : "";
  const [selectedValue, setSelectedValue] = useState<string | "">(
    initialSelectedValue
  );

  const handleSelect = useCallback(
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      if (value === "") {
        setSelectedValue(""); // Resetea el estado del valor seleccionado
      } else {
        const selectedItem = catalog.find(
          (item) => item[propertyKey] === value
        );
        if (selectedItem) {
          onSelect(selectedItem);
        }
        setSelectedValue(value); // Actualiza el estado del valor seleccionado
      }
    },
    [catalog, propertyKey, onSelect]
  );

  // Resetea el valor seleccionado cuando el prop `reset` cambia
  useEffect(() => {
    setSelectedValue("");
  }, [reset]);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={selectedValue} onChange={handleSelect} label={label}>
        {/*  <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
        {catalog.map((item, index) => (
          <MenuItem key={index} value={String(item[propertyKey])}>
            {String(item[propertyKey])}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
