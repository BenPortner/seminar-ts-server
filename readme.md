# Seminar TS Server

This project is a TypeScript-based rewrite of the original [Reveal.js seminar server](https://github.com/rajgoel/seminar). The rewrite leverages TypeScript to improve code maintainability, scalability, and developer experience. It is meant to be a drop-in replacement, meaning all your favorite [Reveal.js plugins](https://github.com/rajgoel/reveal.js-plugins/tree/master/seminar) will still work out of the box.

** NEW ** The server now has a built-in web UI for admins, courtesy of [Socket.IO Admin UI](https://github.com/socketio/socket.io-admin-ui/). From here, you can see information about all connected sockets and rooms. To reach it, start the server and visit `http://your-host:your-port/admin` (e.g. http://localhost:4433/admin).

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/seminar-ts-server.git
   cd seminar-ts-server
   ```

2. **Install Dependencies**:
   Ensure you have Node.js (>= 22.0.0) installed. Then run:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create `.env.dev` and `.env.prod` files in the env directory for development and production configurations. Example:
   ```plaintext
   NODE_ENV=development
   PORT=4433
   SOCKETIO_ADMINUI_AUTH=false
   ```

4. **Run the Server**:
   - For development:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     export NODE_ENV=production
     npm run start
     ```

---

## Clients

Clients can be obtained from the [Reveal.js seminar plugins repository](https://github.com/rajgoel/reveal.js-plugins/tree/master/seminar). If you have a server running on `localhost`, you can check out the live demo [here](https://rajgoel.github.io/reveal.js-demos/?topic=seminar).

---

## Why TypeScript?

TypeScript offers several advantages over vanilla JavaScript:

1. **Static Typing**: Helps catch errors at compile time, reducing runtime bugs.
2. **Improved Tooling**: Provides better IntelliSense, autocompletion, and refactoring support in IDEs.
3. **Scalability**: Improved tooling means it is easier to extend the codebase and implement new features.
4. **Maintainability**: Strong typing and interfaces improve code readability and maintainability.
5. **Modern JavaScript Features**: TypeScript supports the latest JavaScript features and compiles to CommonJS. 

---

## Project Structure

The project is organized as follows:

- **src**: Main source code directory.
  - **`models/`**: Class definitions for `User`, `Room`, and `Message`.
  - **`db/`**: In-memory store for `User`, `Room` and `Message` objects.
  - **`types/`**: Type definitions for events, payloads, and data structures.
  - **`handlers/`**: Event handlers for incoming Socket.IO events.
  - **`utils/`**: Utility functions for common tasks.
  - **`server.ts`**: Main server implementation using Socket.IO.
  - **`main.ts`**: Entry point for the application.
- **public**: Static files served by the server.
- **env**: Environment-specific configuration files.

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a clear description of your changes.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
