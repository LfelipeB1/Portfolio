import subprocess
import json
import os

from flask import Flask, render_template, jsonify

app = Flask(__name__)


# ── Dados do portfólio ──────────────────────────────────────────────

PORTFOLIO_DATA = {
    "name": "Luís Felipe",
    "title": "Desenvolvedor Full Stack",

    "about": (
        "Apaixonado por tecnologia e desenvolvimento de software. "
        "Tenho experiência em Python, Java e desenvolvimento web. "
        "Também possuo experiência com suporte, manutenção de computadores "
        "e infraestrutura de TI. Busco sempre aprender novas tecnologias "
        "e resolver problemas de forma criativa."
    ),

    "email": "luisfelipebaitstadearaujo@gmail.com",

    "github": "https://github.com/LfelipeB1",

    "linkedin": "https://linkedin.com/in/luis-felipe-80a617342",

    "whatsapp": "https://api.whatsapp.com/send/?phone=5588993128660",

    "skills": [
        {"name": "Python", "level": 80},
        {"name": "Java", "level": 80},
        {"name": "HTML/CSS", "level": 80},
        {"name": "JavaScript", "level": 80},
        
    ],

    "projects": [
        {
            "title": "Sistema de Gestão",
            "description": (
                "Aplicação web desenvolvida em Python e Flask "
                "com banco de dados SQLite para gestão de tarefas e projetos."
            ),
            "tech": ["Python", "Flask", "SQLite", "HTML/CSS"],
            "github": "#",
            "demo": "#",
        },

        {
            "title": "API REST em Java",
            "description": (
                "API RESTful construída com Spring Boot para "
                "gerenciamento de usuários, com autenticação JWT."
            ),
            "tech": ["Java", "Spring Boot", "MySQL", "JWT"],
            "github": "#",
            "demo": "#",
        },

        {
            "title": "Portfólio Pessoal",
            "description": (
                "Portfólio desenvolvido com Python Flask no backend "
                "e design responsivo no frontend."
            ),
            "tech": ["Python", "Flask", "HTML", "CSS", "JavaScript"],
            "github": "#",
            "demo": "#",
        },

       
    ],

    "experience": [
        {
            "role": "Aprendiz de TI",
            "company": "Aniger",
            "period": "2023 – Presente",
            "desc": (
                "Atuação com suporte à infraestrutura de TI, atendimento "
                "de chamados, manutenção de computadores, hardware, "
                "instalação e manutenção de câmeras e catracas."
            ),
        },

        {
            "role": "Técnico de Informática",
            "company": "Tec Soluções",
            "period": "Atual",
            "desc": (
                "Responsável pela manutenção dos computadores da empresa, "
                "impressoras, montagem e limpeza de equipamentos, relógio "
                "de ponto, cabeamento de rede e configuração de VLANs."
            ),
        },
    ],
}


# ── Rotas ───────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html", data=PORTFOLIO_DATA)


@app.route("/api/portfolio")
def api_portfolio():
    """Retorna os dados do portfólio em JSON."""
    return jsonify(PORTFOLIO_DATA)


@app.route("/api/java-info")
def java_info():
    """Chama o programa Java e retorna as informações geradas."""

    jar_path = os.path.join(
        os.path.dirname(__file__),
        "java",
        "PortfolioInfo.jar"
    )

    if not os.path.exists(jar_path):
        return jsonify({
            "source": "java-fallback",
            "message": "Componente Java não compilado ainda.",
            "tip": (
                "Execute: cd java && javac PortfolioInfo.java "
                "&& jar cfe PortfolioInfo.jar PortfolioInfo PortfolioInfo.class"
            ),
        })

    try:
        result = subprocess.run(
            ["java", "-jar", jar_path],
            capture_output=True,
            text=True,
            timeout=10,
        )

        output = json.loads(result.stdout)

        return jsonify(output)

    except Exception as exc:
        return jsonify({
            "error": str(exc)
        }), 500


# ── Entry point ─────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)