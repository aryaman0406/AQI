# Contributing to Hyperlocal Air Quality Monitoring System

Thank you for your interest in contributing! We welcome contributions from the community.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, Python/Node version, etc.)

### Suggesting Enhancements

We welcome feature requests! Please create an issue with:
- A clear, descriptive title
- Detailed description of the proposed feature
- Use cases and benefits
- Any mockups or examples (if applicable)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the code style** used in the project
3. **Write clear commit messages**
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Submit a pull request**

## 🔧 Development Setup

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## 📝 Code Style Guidelines

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions focused and modular
- Maximum line length: 100 characters

```python
def calculate_aqi(pollutant: str, concentration: float) -> int:
    """
    Calculate AQI based on pollutant concentration.
    
    Args:
        pollutant: Name of the pollutant (e.g., 'pm25', 'pm10')
        concentration: Concentration value in µg/m³
    
    Returns:
        Calculated AQI value
    """
    # Implementation
    pass
```

### TypeScript (Frontend)

- Use TypeScript strict mode
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable names
- Keep components small and focused

```typescript
interface AQIData {
  location: string;
  aqi: number;
  timestamp: Date;
}

const AQICard: React.FC<{ data: AQIData }> = ({ data }) => {
  // Component implementation
};
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

Please ensure all tests pass before submitting a PR.

## 📋 Commit Message Guidelines

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add 48-hour forecast feature
fix: resolve WebSocket connection timeout
docs: update API documentation
```

## 🔍 Code Review Process

1. All submissions require review
2. Maintainers will review your PR within a few days
3. Address any requested changes
4. Once approved, maintainers will merge your PR

## 🌟 Recognition

Contributors will be recognized in:
- README.md
- Release notes
- Project documentation

## 📞 Questions?

Feel free to:
- Open an issue for questions
- Join our discussions
- Contact maintainers

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Being respectful and inclusive
- Accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behavior:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

### Enforcement

Report violations to project maintainers. All reports will be reviewed confidentially.

---

Thank you for contributing to Hyperlocal Air Quality Monitoring System! 🌍
