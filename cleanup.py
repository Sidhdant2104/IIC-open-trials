import re

with open('/Users/sid/VS code/new/index.html', 'r') as f:
    content = f.read()

# Replace all #register with /register.html
content = content.replace('href="#register"', 'href="/register.html"')

# Revert the entire <section id="register"> back to a simple CTA
new_section = '''  <!-- REGISTER / CTA SECTION -->
  <section id="register" class="cta section-pad reveal-on-scroll">
    <div class="container">
      <div class="cta-box stall-paper">
        <h2 class="section-title">Ready for the Show?</h2>
        <p>Grab your VIP pass to the IIC Open Trials. Step into the spotlight.</p>
        <a href="/register.html" class="btn-primary animate-hover btn-large">Claim Your Ticket</a>
      </div>
    </div>
  </section>'''

content = re.sub(r'  <!-- REGISTER / CTA SECTION -->\n  <section id="register".*?</section>', new_section, content, flags=re.DOTALL)

with open('/Users/sid/VS code/new/index.html', 'w') as f:
    f.write(content)

with open('/Users/sid/VS code/new/script.js', 'r') as f:
    content = f.read()

content = re.sub(r'  // Form Submission Logic\n  const registerForm.*?\}\);\n  \}', '', content, flags=re.DOTALL)

with open('/Users/sid/VS code/new/script.js', 'w') as f:
    f.write(content)

print("Files updated successfully.")
