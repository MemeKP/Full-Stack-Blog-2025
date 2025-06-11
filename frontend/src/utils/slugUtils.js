import slugify from "slugify";

/*ใช้เพื่อ preview URL, เก็บใน localStorage หรือให้ user เห็นว่า slug จะเป็นอะไรเฉย ๆ
จะไม่เอาส่งไป backend เด็ดขาดเพราะจะซ้ำ
*/
export function generateSlug(title) {
  if (!title) return "untitled-" + Date.now();

  const baseSlug = slugify(title, {
    lower: true,       // lowercase
    strict: true,      // remove special characters
    locale: "en"
  });

  // เพิ่ม timestamp เพื่อให้ "น่าจะ" ไม่ซ้ำ
  // ตัวอย่าง: "my-first-post-1689273948103"
  return `${baseSlug}-${Date.now()}`;
}
