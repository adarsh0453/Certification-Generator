import os
from datetime import datetime
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.pdfgen import canvas


def generate_pdf_certificate(
    output_path: str,
    recipient_name: str,
    course_name: str,
    completion_date: str,
    certificate_number: str,
    organization_name: str = "Aereo Learning Institute",
    authorized_signatory: str = "Authorized Signatory",
    signatory_title: str = "Authorized Signature",
    organization_sub: str = "Aereo Learning Institute",
) -> str:
    """
    Generate an executive PDF certificate matching the Aereo Learning Institute design spec.
    """
    # Ensure directory exists and overwrite any stale PDF
    abs_output = os.path.abspath(output_path)
    os.makedirs(os.path.dirname(abs_output), exist_ok=True)
    if os.path.exists(abs_output):
        try:
            os.remove(abs_output)
        except Exception:
            pass

    # A4 Landscape canvas (841.89 x 595.27 points)
    width, height = landscape(A4)
    c = canvas.Canvas(abs_output, pagesize=landscape(A4))

    # Color Palette
    NAVY_DARK = colors.HexColor("#0d1b2a")
    NAVY_MID = colors.HexColor("#1b263b")
    GOLD_MAIN = colors.HexColor("#d97706")
    GOLD_LIGHT = colors.HexColor("#fef3c7")
    GOLD_ACCENT = colors.HexColor("#eab308")
    TEXT_MUTED = colors.HexColor("#64748b")
    BACKGROUND_OFFWHITE = colors.HexColor("#fcfcfd")

    # 0. Fill Background
    c.setFillColor(BACKGROUND_OFFWHITE)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # 1. Guilloche Wave Background Lines (Subtle Security Lines)
    c.setStrokeColor(colors.HexColor("#e2e8f0"))
    c.setLineWidth(0.5)
    for i in range(0, int(width), 40):
        path = c.beginPath()
        path.moveTo(i, 0)
        path.curveTo(i + 80, height * 0.3, i - 40, height * 0.7, i + 60, height)
        c.drawPath(path, fill=0, stroke=1)

    # 2. Top-Left Corner Geometric Ribbon Folds
    p1 = c.beginPath()
    p1.moveTo(0, height)
    p1.lineTo(210, height)
    p1.lineTo(0, height - 210)
    p1.close()
    c.setFillColor(NAVY_DARK)
    c.drawPath(p1, fill=1, stroke=0)

    p2 = c.beginPath()
    p2.moveTo(0, height - 170)
    p2.lineTo(235, height)
    p2.lineTo(255, height)
    p2.lineTo(0, height - 190)
    p2.close()
    c.setFillColor(GOLD_ACCENT)
    c.drawPath(p2, fill=1, stroke=0)

    p3 = c.beginPath()
    p3.moveTo(0, height - 190)
    p3.lineTo(255, height)
    p3.lineTo(270, height)
    p3.lineTo(0, height - 205)
    p3.close()
    c.setFillColor(NAVY_MID)
    c.drawPath(p3, fill=1, stroke=0)

    # 3. Bottom-Right Corner Geometric Ribbon Folds
    br1 = c.beginPath()
    br1.moveTo(width, 0)
    br1.lineTo(width - 210, 0)
    br1.lineTo(width, 210)
    br1.close()
    c.setFillColor(NAVY_DARK)
    c.drawPath(br1, fill=1, stroke=0)

    br2 = c.beginPath()
    br2.moveTo(width, 170)
    br2.lineTo(width - 235, 0)
    br2.lineTo(width - 255, 0)
    br2.lineTo(width, 190)
    br2.close()
    c.setFillColor(GOLD_ACCENT)
    c.drawPath(br2, fill=1, stroke=0)

    br3 = c.beginPath()
    br3.moveTo(width, 190)
    br3.lineTo(width - 255, 0)
    br3.lineTo(width - 270, 0)
    br3.lineTo(width, 205)
    br3.close()
    c.setFillColor(NAVY_MID)
    c.drawPath(br3, fill=1, stroke=0)

    # 4. Double Inner Gold Border Frame
    c.setStrokeColor(GOLD_MAIN)
    c.setLineWidth(1.5)
    c.rect(30, 30, width - 60, height - 60)

    c.setLineWidth(0.75)
    c.rect(34, 34, width - 68, height - 68)

    # Corner Fan Accents (Top-Right & Bottom-Left)
    p_tr = c.beginPath()
    p_tr.moveTo(width - 34, height - 34)
    p_tr.lineTo(width - 50, height - 34)
    p_tr.lineTo(width - 34, height - 50)
    p_tr.close()
    c.setFillColor(GOLD_MAIN)
    c.drawPath(p_tr, fill=1, stroke=0)

    p_bl = c.beginPath()
    p_bl.moveTo(34, 34)
    p_bl.lineTo(50, 34)
    p_bl.lineTo(34, 50)
    p_bl.close()
    c.setFillColor(GOLD_MAIN)
    c.drawPath(p_bl, fill=1, stroke=0)

    # 5. Header Branding (Logo + Text + Subtitle)
    c.setFillColor(NAVY_DARK)
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2.0, height - 75, organization_name)

    c.setFillColor(GOLD_MAIN)
    c.setFont("Helvetica", 8)
    c.drawCentredString(width / 2.0, height - 88, "LEARN   ·   GROW   ·   ACHIEVE")

    # 6. Title Section ("CERTIFICATE OF COMPLETION")
    y_title = height - 140

    c.setFont("Helvetica-Bold", 26)
    w1 = c.stringWidth("CERTIFICATE ", "Helvetica-Bold", 26)
    w2 = c.stringWidth("OF ", "Helvetica-Bold", 26)
    w3 = c.stringWidth("COMPLETION", "Helvetica-Bold", 26)
    total_w = w1 + w2 + w3
    start_x = (width - total_w) / 2.0

    c.setFillColor(NAVY_DARK)
    c.drawString(start_x, y_title, "CERTIFICATE ")
    c.setFillColor(GOLD_MAIN)
    c.drawString(start_x + w1, y_title, "OF ")
    c.setFillColor(NAVY_DARK)
    c.drawString(start_x + w1 + w2, y_title, "COMPLETION")

    # Diamond Flourish Ornament Line below Title
    c.setStrokeColor(GOLD_MAIN)
    c.setLineWidth(1)
    c.line(width / 2.0 - 90, y_title - 15, width / 2.0 - 15, y_title - 15)
    c.line(width / 2.0 + 15, y_title - 15, width / 2.0 + 90, y_title - 15)

    d_path = c.beginPath()
    d_path.moveTo(width / 2.0, y_title - 10)
    d_path.lineTo(width / 2.0 + 6, y_title - 15)
    d_path.lineTo(width / 2.0, y_title - 20)
    d_path.lineTo(width / 2.0 - 6, y_title - 15)
    d_path.close()
    c.setFillColor(GOLD_MAIN)
    c.drawPath(d_path, fill=1, stroke=0)

    # 7. Subtitle
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica", 10)
    c.drawCentredString(width / 2.0, y_title - 42, "THIS CERTIFICATE IS PROUDLY PRESENTED TO")

    # 8. Recipient Name (Calligraphic Script)
    y_name = y_title - 95
    c.setFillColor(colors.HexColor("#0f2b48"))
    c.setFont("Times-BoldItalic", 34)
    c.drawCentredString(width / 2.0, y_name, recipient_name)

    # Underline
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(1.5)
    c.line(width / 2.0 - 150, y_name - 10, width / 2.0 + 150, y_name - 10)

    # 9. Course Info
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica", 11)
    c.drawCentredString(width / 2.0, y_name - 38, "for successfully completing the course/event")

    c.setFillColor(NAVY_DARK)
    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(width / 2.0, y_name - 70, course_name)

    # 10. Bottom 3-Column Layout

    # Left Column: Metadata List with Icons & Divider Line
    meta_x = 85
    meta_y = 145

    # Completion Date
    c.setFillColor(GOLD_MAIN)
    c.rect(meta_x, meta_y - 2, 12, 12, fill=1, stroke=0)
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(meta_x + 20, meta_y + 4, "Completion Date")
    c.setFillColor(NAVY_DARK)
    c.setFont("Helvetica", 9)
    c.drawString(meta_x + 20, meta_y - 7, completion_date)

    # Certificate ID
    c.setFillColor(GOLD_MAIN)
    c.rect(meta_x, meta_y - 42, 12, 12, fill=1, stroke=0)
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(meta_x + 20, meta_y - 36, "Certificate ID")
    c.setFillColor(NAVY_DARK)
    c.setFont("Helvetica", 9)
    c.drawString(meta_x + 20, meta_y - 47, certificate_number)

    # Issued On
    c.setFillColor(GOLD_MAIN)
    c.rect(meta_x, meta_y - 82, 12, 12, fill=1, stroke=0)
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(meta_x + 20, meta_y - 76, "Issued On")
    c.setFillColor(NAVY_DARK)
    c.setFont("Helvetica", 9)
    c.drawString(meta_x + 20, meta_y - 87, completion_date)

    # Vertical Gold Separator Line
    c.setStrokeColor(GOLD_MAIN)
    c.setLineWidth(1)
    c.line(265, 55, 265, 160)

    # Center Column: Premium Gold & Navy Ribbon Badge
    badge_x = width / 2.0
    badge_y = 115

    # Ribbon Tails
    tail_h = 45
    t1 = c.beginPath()
    t1.moveTo(badge_x - 18, badge_y - 10)
    t1.lineTo(badge_x - 30, badge_y - tail_h - 15)
    t1.lineTo(badge_x - 18, badge_y - tail_h - 5)
    t1.lineTo(badge_x - 6, badge_y - tail_h - 15)
    t1.lineTo(badge_x - 6, badge_y - 10)
    t1.close()
    c.setFillColor(NAVY_DARK)
    c.drawPath(t1, fill=1, stroke=0)

    t2 = c.beginPath()
    t2.moveTo(badge_x + 6, badge_y - 10)
    t2.lineTo(badge_x + 6, badge_y - tail_h - 15)
    t2.lineTo(badge_x + 18, badge_y - tail_h - 5)
    t2.lineTo(badge_x + 30, badge_y - tail_h - 15)
    t2.lineTo(badge_x + 18, badge_y - 10)
    t2.close()
    c.setFillColor(NAVY_DARK)
    c.drawPath(t2, fill=1, stroke=0)

    # Scalloped Outer Gold Seal Circle
    c.setFillColor(GOLD_MAIN)
    c.circle(badge_x, badge_y, 36, fill=1, stroke=0)

    # Inner Dark Navy Circle
    c.setFillColor(NAVY_DARK)
    c.circle(badge_x, badge_y, 30, fill=1, stroke=0)

    # Gold Ring
    c.setStrokeColor(GOLD_MAIN)
    c.setLineWidth(1.5)
    c.circle(badge_x, badge_y, 27, fill=0, stroke=1)

    # Laurel Wreath / Badge Text
    c.setFillColor(GOLD_MAIN)
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(badge_x, badge_y + 8, "CERTIFIED")
    c.drawCentredString(badge_x, badge_y - 2, "LEARNER")
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(badge_x, badge_y - 13, "★ ★ ★")

    # Right Column: Signature Block
    sig_x = width - 180
    sig_y = 110

    # Blue Script Signature
    c.setFillColor(colors.HexColor("#1d4ed8"))
    c.setFont("Times-BoldItalic", 22)
    c.drawCentredString(sig_x, sig_y + 12, authorized_signatory)

    # Signature Line
    c.setStrokeColor(GOLD_MAIN)
    c.setLineWidth(1)
    c.line(sig_x - 80, sig_y, sig_x + 80, sig_y)

    c.setFillColor(NAVY_DARK)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(sig_x, sig_y - 14, signatory_title)
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(sig_x, sig_y - 25, organization_sub)

    # Save PDF
    c.save()
    return abs_output
