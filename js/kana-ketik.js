/* Penilaian jawaban ketik (Hafalan mode Ketik, latihan isi partikel).
   Siswa boleh mengetik kana langsung (IME Jepang) ATAU romaji - romaji
   diubah ke hiragana di sini, jadi HP tanpa keyboard Jepang tetap bisa
   dipakai. Hiragana & katakana dianggap sama, spasi/tanda baca diabaikan,
   dan partikel は/へ/を yang diketik "wa/e/o" tetap dianggap benar. */
(function () {
  const TABEL = {
    a: "あ", i: "い", u: "う", e: "え", o: "お",
    ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
    ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
    sa: "さ", si: "し", shi: "し", su: "す", se: "せ", so: "そ",
    za: "ざ", zi: "じ", ji: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
    ta: "た", ti: "ち", chi: "ち", tu: "つ", tsu: "つ", te: "て", to: "と",
    da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
    na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
    ha: "は", hi: "ひ", hu: "ふ", fu: "ふ", he: "へ", ho: "ほ",
    ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
    pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
    ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
    ya: "や", yu: "ゆ", yo: "よ",
    ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
    la: "ら", li: "り", lu: "る", le: "れ", lo: "ろ",
    wa: "わ", wo: "を", wi: "うぃ", we: "うぇ",
    va: "ゔぁ", vi: "ゔぃ", vu: "ゔ", ve: "ゔぇ", vo: "ゔぉ",
    fa: "ふぁ", fi: "ふぃ", fe: "ふぇ", fo: "ふぉ",
    ti_: "てぃ", di_: "でぃ",
    sha: "しゃ", shu: "しゅ", she: "しぇ", sho: "しょ",
    cha: "ちゃ", chu: "ちゅ", che: "ちぇ", cho: "ちょ",
    ja: "じゃ", ju: "じゅ", je: "じぇ", jo: "じょ",
    tsa: "つぁ",
    xa: "ぁ", xi: "ぃ", xu: "ぅ", xe: "ぇ", xo: "ぉ", xtu: "っ", xtsu: "っ", ltu: "っ", xya: "ゃ", xyu: "ゅ", xyo: "ょ",
  };
  // ky-, gy-, ny-, ... : konsonan + y + vokal = suku -i + ya/yu/yo kecil.
  const KECIL = { a: "ゃ", u: "ゅ", o: "ょ", e: "ぇ" };
  ["k", "g", "s", "z", "t", "d", "n", "h", "b", "p", "m", "r", "l", "j", "c"].forEach((k) => {
    const dasar = TABEL[k + "i"] || (k === "c" ? "ち" : null);
    if (!dasar) return;
    Object.entries(KECIL).forEach(([v, kecil]) => {
      TABEL[k + "y" + v] = dasar + kecil;
    });
  });
  const KUNCI = Object.keys(TABEL).filter((k) => !k.endsWith("_")).sort((a, b) => b.length - a.length);

  function romajiKeHiragana(teks) {
    const s = String(teks).toLowerCase();
    let hasil = "";
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (!/[a-z]/.test(c)) {
        hasil += c === "-" ? "ー" : c;
        i++;
        continue;
      }
      // n sebelum konsonan / akhir kata / n' / nn = ん
      if (c === "n") {
        const next = s[i + 1];
        if (next === "'" ) { hasil += "ん"; i += 2; continue; }
        if (next === "n" && !/[aiueoy]/.test(s[i + 2] || "")) { hasil += "ん"; i += 2; continue; }
        if (next === undefined || !/[aiueoy]/.test(next)) { hasil += "ん"; i++; continue; }
      }
      // konsonan ganda = っ (kk, tt, ss, pp, tch)
      if (c !== "n" && /[bcdfghjklmpqrstvwxyz]/.test(c) && (s[i + 1] === c || (c === "t" && s[i + 1] === "c"))) {
        hasil += "っ";
        i++;
        continue;
      }
      const kunci = KUNCI.find((k) => s.startsWith(k, i));
      if (kunci) {
        hasil += TABEL[kunci];
        i += kunci.length;
      } else {
        hasil += c; // huruf yang tidak dikenal dibiarkan (jawaban jadi salah)
        i++;
      }
    }
    return hasil;
  }

  function keHiragana(teks) {
    return String(teks).replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  }

  /* Bentuk pembanding: hiragana, tanpa spasi/tanda baca/catatan （…）. */
  function normalKetik(teks) {
    let t = String(teks).normalize("NFKC").trim();
    if (/[a-zA-Z]/.test(t)) t = romajiKeHiragana(t);
    t = keHiragana(t)
      .replace(/（[^）]*）|\([^)]*\)/g, "")
      .replace(/[\s、。，．,.!?！？「」～~・]/g, "");
    return t;
  }
  // Vokal tiap kana (dari tabel romaji) untuk membaca tanda panjang ー.
  const VOKAL = { ゃ: "あ", ゅ: "う", ょ: "お", ぁ: "あ", ぃ: "い", ぅ: "う", ぇ: "え", ぉ: "お" };
  const HURUF_VOKAL = { a: "あ", i: "い", u: "う", e: "え", o: "お" };
  Object.entries(TABEL).forEach(([romaji, kana]) => {
    if (kana.length === 1 && !(kana in VOKAL)) VOKAL[kana] = HURUF_VOKAL[romaji.slice(-1)];
  });
  function longgar(teks) {
    return teks
      .replace(/(.)ー/g, (m, c) => c + (VOKAL[c] || "ー"))
      .replace(/は/g, "わ").replace(/を/g, "お").replace(/へ/g, "え");
  }

  /* jawaban: satu string atau beberapa alternatif (pisahkan dengan ／). */
  function cocokKetik(ketikan, jawaban) {
    const k = normalKetik(ketikan);
    if (!k) return false;
    // Bagian dalam kurung boleh diketik atau tidak: しずか（な）, （お）なまえ.
    return String(jawaban)
      .split("／")
      .flatMap((alt) => [normalKetik(alt), normalKetik(alt.replace(/[（(]([^）)]*)[）)]/g, "$1"))])
      .some((j) => j === k || longgar(j) === longgar(k));
  }

  window.KanaKetik = { romajiKeHiragana, normalKetik, cocokKetik };
})();
