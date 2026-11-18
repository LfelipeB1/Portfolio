import subprocess
import json
import os

from flask import Flask, render_template, jsonify

app = Flask(__name__)


# ── Dados do portfólio ──────────────────────────────────────────────

PORTFOLIO_DATA = {
    "name": "Luís Felipe",
    "title": "Desenvolvedor Full Stack",

    "about": [
        (
            "Sou Desenvolvedor Full Stack com perfil empreendedor, forte visão de "
            "negócio e uma trajetória sólida que une o desenvolvimento de software "
            "à experiência prática em infraestrutura e atendimento corporativo. Não "
            "enxergo a tecnologia apenas como código, mas como uma ferramenta "
            "estratégica para resolver gargalos operacionais, melhorar a experiência "
            "do cliente e impulsionar vendas."
        ),
        (
            "Minha base técnica foi construída ao longo de 4 anos de atuação na área "
            "de Tecnologia da Informação — sendo 2 anos no ambiente corporativo da "
            "Aniger, atuando no Suporte de TI, e 2 anos como Técnico de TI na Tec "
            "Soluções. Essa vivência intensa na linha de frente, lidando diariamente "
            "com o atendimento de chamados, suporte direto ao usuário e diagnóstico "
            "ágil de falhas, desenvolveu em mim uma capacidade acima da média para "
            "resolver problemas complexos sob pressão e traduzir necessidades "
            "técnicas em soluções simples e funcionais."
        ),
        (
            "Além do domínio técnico, trago comigo bagagem na área de "
            "empreendedorismo e uma comunicação altamente persuasiva. Tenho "
            "facilidade para dialogar, negociar e apresentar propostas de valor "
            "diretamente a tomadores de decisão, conectando as entregas do "
            "desenvolvimento aos objetivos comerciais de cada projeto."
        ),
    ],

    "differentials": [
        {
            "icon": "fa-solid fa-chart-line",
            "title": "Desenvolvimento Full Stack Orientado a Resultados",
            "desc": (
                "Construção de aplicações e lojas virtuais pensadas tanto na "
                "arquitetura técnica quanto na experiência final do usuário e na "
                "conversão comercial."
            ),
        },
        {
            "icon": "fa-solid fa-bolt",
            "title": "Resolução Ágil de Problemas",
            "desc": (
                "Bagagem comprovada em suporte técnico corporativo (Aniger e Tec "
                "Soluções), garantindo eficiência na identificação de bugs, "
                "manutenção e estabilidade de sistemas."
            ),
        },
        {
            "icon": "fa-solid fa-handshake",
            "title": "Visão Empreendedora e Negociação",
            "desc": (
                "Capacidade de entender a dor do cliente, alinhar expectativas e "
                "defender soluções técnicas com clareza diante de gestores e "
                "investidores."
            ),
        },
    ],

    "email": "luisfelipebatistadearaujo@gmail.com",

    "github": "https://github.com/LfelipeB1",

    "linkedin": "https://linkedin.com/in/luis-felipe-80a617342",

    "whatsapp": "https://api.whatsapp.com/send/?phone=5588993128660",

    "skills": [
        {"name": "Python", "level": 80},
        {"name": "Java", "level": 80},
        {"name": "HTML/CSS", "level": 80},
        {"name": "JavaScript", "level": 80},
    ],

    "phone_display": "+55 (88) 99312-8660",

    "services": [
        {
            "icon": "fa-solid fa-code",
            "title": "Desenvolvimento Web",
            "desc": "Sites e aplicações web com Python, Flask, Java e JavaScript.",
        },
        {
            "icon": "fa-solid fa-headset",
            "title": "Suporte Técnico",
            "desc": "Atendimento de chamados e resolução de problemas do dia a dia.",
        },
        {
            "icon": "fa-solid fa-network-wired",
            "title": "Infraestrutura & Redes",
            "desc": "Cabeamento de rede, configuração de VLANs, câmeras e catracas.",
        },
        {
            "icon": "fa-solid fa-screwdriver-wrench",
            "title": "Manutenção de Hardware",
            "desc": "Montagem, limpeza e manutenção de computadores e impressoras.",
        },
    ],

    "skill_groups": [
        {
            "title": "Desenvolvimento",
            "items": ["Python", "Java", "JavaScript", "HTML/CSS", "Flask"],
        },
        {
            "title": "Infraestrutura & Redes",
            "items": ["Cabeamento de rede", "Configuração de VLANs", "Câmeras e catracas", "Relógio de ponto"],
        },
        {
            "title": "Suporte & Hardware",
            "items": ["Atendimento de chamados", "Manutenção de computadores", "Impressoras", "Montagem de equipamentos"],
        },
    ],

    "projects": [
        {
            "title": "Água e Corpo",
            "category": "E-commerce de Moda e Vestuário",
            "description": (
                "Desenvolvimento completo da plataforma de vendas online da marca. "
                "O projeto foi estruturado para oferecer uma vitrine digital moderna "
                "e responsiva, com navegação intuitiva por coleções, foco em "
                "performance e uma jornada de compra otimizada para maximizar a "
                "conversão de visitantes em clientes."
            ),
            "tech": ["HTML", "CSS", "JavaScript", "Java"],
        },
        {
            "title": "Bela Cosméticos",
            "category": "E-commerce de Beleza e Cosméticos",
            "description": (
                "Criação de loja virtual pensada para lidar com um catálogo dinâmico "
                "e variado de produtos. A solução prioriza a organização visual, "
                "facilidade na busca de itens, agilidade no processo de checkout e "
                "uma experiência de compra fluida que fortalece a confiança e a "
                "recorrência dos consumidores."
            ),
            "tech": ["HTML", "CSS", "JavaScript", "Java"],
        },
        {
            "title": "Sistema de Gestão",
            "category": "Aplicação Web",
            "description": (
                "Aplicação web desenvolvida em Python e Flask "
                "com banco de dados SQLite para gestão de tarefas e projetos."
            ),
            "tech": ["Python", "Flask", "SQLite", "HTML", "CSS"],
        },
        {
            "title": "Portfólio Pessoal",
            "category": "Site Pessoal",
            "description": (
                "Portfólio desenvolvido com Python Flask no backend "
                "e design responsivo no frontend."
            ),
            "tech": ["Python", "Flask", "HTML", "CSS", "JavaScript"],
        },
    ],

    "experience": [
        {
            "role": "Aprendiz de TI",
            "company": "Aniger",
            "period": "2023 – Jul 2026",
            "desc": (
                "Atuação com suporte à infraestrutura de TI, atendimento "
                "de chamados, manutenção de computadores, hardware, "
                "instalação e manutenção de câmeras e catracas."
            ),
            "highlights": [
                "Suporte à infraestrutura de TI",
                "Atendimento de chamados",
                "Manutenção de computadores e hardware",
                "Instalação e manutenção de câmeras e catracas",
            ],
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
            "highlights": [
                "Manutenção de computadores e impressoras",
                "Montagem e limpeza de equipamentos",
                "Instalação e configuração de relógio de ponto",
                "Cabeamento de rede e configuração de VLANs",
            ],
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