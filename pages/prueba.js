import countries from "@/lib/countries";

export default function Prueba() {
  return (
    <div>
      <h1>Listado de países</h1>
      <ul>
        {countries.map((c) => (
          <li key={c.code}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}
