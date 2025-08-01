
function convertText() {
  const lines = document.getElementById("inputText").value.split("\n").map(l => l.trim()).filter(Boolean);
  const product = document.getElementById("productLine").value;
  const page = document.getElementById("pageLine").value;
  const map = { id: '', name: '', cod: '', address: '', phone: '', fb: '', admin: '', zip: '', province: '', tambon: '', amphur: '' };

  let i = 0;
  const first = lines[0];
  if (/^K\d+/.test(first)) {
    map.id = first.trim();
    map.name = lines[1]?.trim() || '';
    i = 2;
  } else {
    map.name = first;
    i = 1;
  }

  for (; i < lines.length; i++) {
    const line = lines[i];
    if (/COD[:：]/i.test(line)) {
      const m = line.match(/(\d+)/); if (m) map.cod = m[1];
    } else if (/\d{9,}/.test(line)) {
      map.phone = line.match(/\d{9,}/)?.[0];
    } else if (/Fb[:：]/i.test(line)) {
      map.fb = line.split(/[:：]/)[1]?.trim();
    } else if (/Admin[:：]/i.test(line)) {
      map.admin = line.split(/[:：]/)[1]?.trim();
    } else if (/\d{5}$/.test(line)) {
      map.zip = line.match(/\d{5}$/)[0];
      const p = line.match(/จ\.?\s*(\S+)/); if (p) map.province = p[1];
      const clean = line.replace(/จ\..*/g, '').replace(/\d{5}/, '').replace(/📌.*$/, '').replace(/Pg:.*$/, '').trim();
      map.address += (map.address ? ' ' : '') + clean;
    } else if (/ต\./.test(line)) {
      const t = line.match(/ต\.(\S+)/); if (t) map.tambon = 'ต.' + t[1];
      map.address += (map.address ? ' ' : '') + line;
    } else if (/อ\./.test(line)) {
      const a = line.match(/อ\.(\S+)/); if (a) map.amphur = a[1];
    } else if (!line.includes("📌") && !line.includes("Pg:")) {
      map.address += (map.address ? ' ' : '') + line;
    }
  }

  const fullAddress = map.tambon
    ? map.amphur === 'เมือง' && map.province
      ? `${map.address} ,อ.${map.amphur}${map.province}`
      : `${map.address} อ.${map.amphur}`
    : map.address;

  const today = new Date().toISOString().split("T")[0];
  const output = [
    `=${map.id ? map.id + '.' : ''}${map.name}`,
    `=${product}`,
    `=COD/${map.cod}`,
    `=${fullAddress}`,
    `=${map.province}`,
    `=${map.zip}`,
    `=${map.phone}`,
    `=${map.fb}`,
    `=${map.admin}`,
    `=${page}`,
    `=${today}`
  ];
  document.getElementById("output").textContent = output.join("\n");
}

function copyResult() {
  const text = document.getElementById("output").textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ คัดลอกผลลัพธ์เรียบร้อยแล้ว!");
  });
}

function clearForm() {
  document.getElementById("inputText").value = "";
  document.getElementById("output").textContent = "";
}
