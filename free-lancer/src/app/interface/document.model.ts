export interface UserDocument {
  id: string;
  userId: string | number; // ID do usuário (empresa ou freelancer)
  fileName: string; // Nome do arquivo (ex: "Curriculo_2024.pdf")
  fileType: string; // ex: "application/pdf"
  downloadUrl: string; // URL do Firebase Storage
  uploadedAt: string; // Data (ISO string)
}