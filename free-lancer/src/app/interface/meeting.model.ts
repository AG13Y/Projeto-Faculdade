export interface Meeting {
  id: string;
  userId: string | number; // Para quem é esta reunião
  title: string;          // Título da reunião
  date: string;           // Data no formato YYYY-MM-DD
  time: string;           // Hora (ex: "14:30")
}