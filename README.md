<div align="center">
  <h1>AwesomeHub </h1>
  <p>A modern, searchable hub for all "Awesome XYZ" lists on GitHub</p>

  [![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-orange?style=for-the-badge)](https://hacktoberfest.digitalocean.com/)
</div>

## About

AwesomeHub is a centralized platform that aggregates, categorizes, and makes discoverable all the amazing "Awesome" lists scattered across GitHub. From `awesome-react` to `awesome-machine-learning`, we bring together the best curated resources for developers, designers, and tech enthusiasts.

### Features

- **Smart Search**: Find repositories by name, description, topics, or programming language
- **Real-time Stats**: Live metrics on repositories, stars, and contributors
- **Smart Categorization**: Automatic categorization and tagging of repositories
- **Trending**: Discover trending and newly added awesome lists

## Visual Tour

Here are some screenshots/GIF showcasing the features of AwesomeHub:

### Homepage
<img src="https://github.com/user-attachments/assets/b19f7c2a-cbb0-4e05-9f65-961f3fc0a983" alt="Main Dashboard ScreenShot" width="800" />
<br>

*A glimpse of the AwesomeHub homepage, featuring the search bar and featured repositories.*

### Search in Action

   ![Search GIF]()
   <br>
*Searching for "awesome-python" and getting instant results.*

### Live Demo (GIF)
   ![Awesome List GIF](https://github.com/user-attachments/assets/3da8d87e-79f4-4244-ab89-595a34dd6134)
   <br>
*An animated demonstration of exploring awesome lists.*

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Docker and Docker Compose (for database)
- GitHub Personal Access Token (optional, for higher rate limits)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/awesome-hub.git
   cd awesome-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the database**
   ```bash
   npm run db:start
   ```

4. **Set up environment variables**
   ```bash
   cp .env.local.example .env
   ```
   
   Edit `.env` and add your GitHub token:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token_here
   DATABASE_URL="postgresql://awesomehub:awesomehub@localhost:5432/awesomehub_dev"
   ```

5. **Initialize the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

6. **Start the development server**
    ```bash   
    npm run dev
    ```

**Quick Setup (Alternative)**

After cloning and installing dependencies, you can use the setup script: 
```bash
    # Set up everything at once (database + seed data)
    npm run setup
    # Start development server
    npm run dev
```
## Contributing

We welcome contributions of all skill levels! This project is designed to provide meaningful contribution opportunities for **Hacktoberfest 2025** participants.


### Quick Start

1. **Fork & Clone** the repository
2. **Set up development environment**:
   ```bash
   npm install
   npm run setup    # Starts database + seeds data
   npm run dev      # Start development server
   ```
3. **Make your changes** and test thoroughly
4. **Submit a Pull Request**

For comprehensive contribution guidelines, development setup, coding standards, and project structure, please see the **[Contributing Guide](CONTRIBUTING.md)**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ for the developer community</p>
  <p>⭐ Star this repository if you find it useful!</p>
</div>
