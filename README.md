# Brazilian Mock Data Generator

A modern web application built with **React**, **Vite**, and the **Carbon Design System** to generate valid random data for Brazilian documents. This tool is useful for developers and testers who need valid CPF, CNPJ, and RG numbers for testing purposes.

## Features

- **CPF Generator**: Generates valid CPFs with correct check digits.
- **CNPJ Generator**: Generates valid CNPJs with correct check digits.
- **RG Generator**: Generates random RG numbers.
- **Formatting**: Toggle between formatted (e.g., `123.456.789-00`) and unformatted (e.g., `12345678900`) output.
- **Copy to Clipboard**: Easily copy generated numbers with a single click.
- **Responsive Design**: Clean and professional interface using IBM's Carbon Design System.

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Sass](https://sass-lang.com/)

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd BraMockData
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
```

## License

This project is open source and available under the [MIT License](LICENSE).
