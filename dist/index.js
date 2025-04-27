// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/data/data-loader.ts
import fs from "fs";
import path from "path";
var categories = [
  { id: 1, name: "Burger", nameKorean: "\uBC84\uAC70", imageUrl: "" },
  { id: 2, name: "Chicken", nameKorean: "\uCE58\uD0A8", imageUrl: "" },
  { id: 3, name: "Pizza", nameKorean: "\uD53C\uC790", imageUrl: "" },
  { id: 4, name: "Coffee/Drinks", nameKorean: "\uCEE4\uD53C/\uC74C\uB8CC", imageUrl: "" },
  { id: 5, name: "Dessert", nameKorean: "\uB514\uC800\uD2B8/\uBCA0\uC774\uCEE4\uB9AC", imageUrl: "" },
  { id: 6, name: "Korean", nameKorean: "\uD55C\uC2DD", imageUrl: "" },
  { id: 7, name: "Japanese", nameKorean: "\uC77C\uC2DD", imageUrl: "" },
  { id: 8, name: "Chinese", nameKorean: "\uC911\uC2DD", imageUrl: "" },
  { id: 9, name: "Tea/Bubble Tea", nameKorean: "\uCC28/\uBC00\uD06C\uD2F0", imageUrl: "" },
  { id: 10, name: "Waffle/Toast", nameKorean: "\uC640\uD50C/\uD1A0\uC2A4\uD2B8", imageUrl: "" },
  { id: 11, name: "Meal Kit", nameKorean: "\uBC00\uD0A4\uD2B8", imageUrl: "" },
  { id: 12, name: "Smoothie/Juice", nameKorean: "\uC2A4\uBB34\uB514/\uC8FC\uC2A4", imageUrl: "" },
  { id: 13, name: "Snack", nameKorean: "\uBD84\uC2DD", imageUrl: "" },
  { id: 14, name: "Western", nameKorean: "\uC591\uC2DD", imageUrl: "" },
  { id: 15, name: "Nuts", nameKorean: "\uACAC\uACFC\uB958", imageUrl: "" }
];
var allergens = [
  { id: 1, name: "Wheat", nameKorean: "\uBC00" },
  { id: 2, name: "Milk", nameKorean: "\uC720\uC81C\uD488" },
  { id: 3, name: "Eggs", nameKorean: "\uACC4\uB780" },
  { id: 4, name: "Fish", nameKorean: "\uC0DD\uC120" },
  { id: 5, name: "Shellfish", nameKorean: "\uC870\uAC1C\uB958" },
  { id: 6, name: "Peanuts", nameKorean: "\uB545\uCF69" },
  { id: 7, name: "Tree Nuts", nameKorean: "\uACAC\uACFC\uB958" },
  { id: 8, name: "Soy", nameKorean: "\uB300\uB450" }
];
var franchiseMap = {
  // 1. 버거 카테고리
  "\uB9E5\uB3C4\uB0A0\uB4DC": { id: 1, categoryId: 1, logoUrl: "" },
  "\uBC84\uAC70\uD0B9": { id: 2, categoryId: 1, logoUrl: "" },
  "\uB86F\uB370\uB9AC\uC544": { id: 3, categoryId: 1, logoUrl: "" },
  "KFC": { id: 4, categoryId: 1, logoUrl: "" },
  "\uB9D8\uC2A4\uD130\uCE58": { id: 5, categoryId: 1, logoUrl: "" },
  "\uB178\uBE0C\uB79C\uB4DC\uBC84\uAC70": { id: 6, categoryId: 1, logoUrl: "" },
  "\uD504\uB7AD\uD06C\uBC84\uAC70": { id: 7, categoryId: 1, logoUrl: "" },
  "\uC564\uD2F0\uC564\uC2A4": { id: 8, categoryId: 1, logoUrl: "" },
  // 2. 치킨 카테고리
  "BBQ": { id: 9, categoryId: 2, logoUrl: "" },
  "\uAD50\uCD0C\uCE58\uD0A8": { id: 10, categoryId: 2, logoUrl: "" },
  "\uAD7D\uB124\uCE58\uD0A8": { id: 11, categoryId: 2, logoUrl: "" },
  "\uD638\uC2DD\uC774\uB450\uB9C8\uB9AC\uCE58\uD0A8": { id: 12, categoryId: 2, logoUrl: "" },
  "\uCE58\uD0A8\uD50C\uB7EC\uC2A4": { id: 13, categoryId: 2, logoUrl: "" },
  "\uC790\uB2F4\uCE58\uD0A8": { id: 14, categoryId: 2, logoUrl: "" },
  "\uB610\uB798\uC624\uB798": { id: 15, categoryId: 2, logoUrl: "" },
  "\uBA55\uC2DC\uCE74\uB098": { id: 16, categoryId: 2, logoUrl: "" },
  "\uBE44\uBE44\uD050": { id: 17, categoryId: 2, logoUrl: "" },
  // 3. 피자 카테고리
  "\uB3C4\uBBF8\uB178\uD53C\uC790": { id: 18, categoryId: 3, logoUrl: "" },
  "\uD53C\uC790\uD5DB": { id: 19, categoryId: 3, logoUrl: "" },
  "\uBBF8\uC2A4\uD130\uD53C\uC790": { id: 20, categoryId: 3, logoUrl: "" },
  "\uD30C\uD30C\uC874\uC2A4": { id: 21, categoryId: 3, logoUrl: "" },
  "\uD53C\uC790\uC54C\uBCFC\uB85C": { id: 22, categoryId: 3, logoUrl: "" },
  "\uD53C\uC790\uB9C8\uB8E8": { id: 23, categoryId: 3, logoUrl: "" },
  "\uD53C\uC790\uC2A4\uCFE8": { id: 24, categoryId: 3, logoUrl: "" },
  "\uCCAD\uB144\uD53C\uC790": { id: 25, categoryId: 3, logoUrl: "" },
  "\uC784\uC2E4N\uCE58\uC988\uD53C\uC790": { id: 26, categoryId: 3, logoUrl: "" },
  "7\uBC88\uAC00\uD53C\uC790": { id: 27, categoryId: 3, logoUrl: "" },
  "\uD53C\uC790\uB098\uB77C\uCE58\uD0A8\uACF5\uC8FC": { id: 28, categoryId: 3, logoUrl: "" },
  "\uD53C\uC790\uC5D0\uB545": { id: 29, categoryId: 3, logoUrl: "" },
  // 4. 커피/음료 카테고리
  "\uC2A4\uD0C0\uBC85\uC2A4": { id: 30, categoryId: 4, logoUrl: "" },
  "\uD22C\uC378\uD50C\uB808\uC774\uC2A4": { id: 31, categoryId: 4, logoUrl: "" },
  "\uC774\uB514\uC57C": { id: 32, categoryId: 4, logoUrl: "" },
  "\uBA54\uAC00\uCEE4\uD53C": { id: 33, categoryId: 4, logoUrl: "" },
  "\uBE7D\uB2E4\uBC29": { id: 34, categoryId: 4, logoUrl: "" },
  "\uCEE4\uD53C\uBE48": { id: 35, categoryId: 4, logoUrl: "" },
  "\uD560\uB9AC\uC2A4": { id: 36, categoryId: 4, logoUrl: "" },
  "\uB354\uBCA4\uD2F0": { id: 37, categoryId: 4, logoUrl: "" },
  "\uCEF4\uD3EC\uC988\uCEE4\uD53C": { id: 38, categoryId: 4, logoUrl: "" },
  "\uC5D4\uC81C\uB9AC\uB108\uC2A4": { id: 39, categoryId: 4, logoUrl: "" },
  "\uD30C\uC2A4\uCFE0\uCC0C": { id: 40, categoryId: 4, logoUrl: "" },
  "\uB4DC\uB86D\uD0D1": { id: 41, categoryId: 4, logoUrl: "" },
  "\uD0D0\uC564\uD0D0\uC2A4": { id: 42, categoryId: 4, logoUrl: "" },
  "\uB9E4\uBA38\uB4DC \uC775\uC2A4\uD504\uB808\uC2A4": { id: 43, categoryId: 4, logoUrl: "" },
  "\uD1A0\uD504\uB808\uC18C": { id: 44, categoryId: 4, logoUrl: "" },
  "\uB354\uB9AC\uD130": { id: 45, categoryId: 4, logoUrl: "" },
  "\uBC14\uB098\uD504\uB808\uC18C": { id: 46, categoryId: 4, logoUrl: "" },
  "\uBE14\uB8E8\uC0E5": { id: 47, categoryId: 4, logoUrl: "" },
  // 5. 디저트/베이커리 카테고리
  "\uD30C\uB9AC\uBC14\uAC8C\uB728": { id: 48, categoryId: 5, logoUrl: "" },
  "\uB69C\uB808\uC96C\uB974": { id: 49, categoryId: 5, logoUrl: "" },
  "\uB358\uD0A8\uB3C4\uB108\uCE20": { id: 50, categoryId: 5, logoUrl: "" },
  "\uD06C\uB9AC\uC2A4\uD53C\uD06C\uB9BC\uB3C4\uB11B": { id: 51, categoryId: 5, logoUrl: "" },
  "\uBC30\uC2A4\uD0A8\uB77C\uBE48\uC2A4": { id: 52, categoryId: 5, logoUrl: "" },
  "\uB514\uC800\uD2B839": { id: 53, categoryId: 5, logoUrl: "" },
  "\uD06C\uB85C\uD50C\uB355\uC624\uB9AC\uC544\uAC00\uC528": { id: 54, categoryId: 5, logoUrl: "" },
  "\uB9DD\uC6D0\uB3D9\uD2F0\uB77C\uBBF8\uC218": { id: 55, categoryId: 5, logoUrl: "" },
  "\uB864\uB9C1\uD540": { id: 56, categoryId: 5, logoUrl: "" },
  "\uD06C\uB77C\uC0C1\uC810": { id: 57, categoryId: 5, logoUrl: "" },
  "\uBABB\uB09C\uC774\uAF48\uBC30\uAE30": { id: 58, categoryId: 5, logoUrl: "" },
  "\uC694\uAC70\uD2B8\uC544\uC774\uC2A4\uD06C\uB9BC\uC758 \uC815\uC11D": { id: 59, categoryId: 5, logoUrl: "" },
  "\uC2A4\uD2B8\uB9BF\uCE04\uB7EC\uC2A4": { id: 60, categoryId: 5, logoUrl: "" },
  "\uB85C\uB760\uBC88": { id: 61, categoryId: 5, logoUrl: "" },
  "\uBE44\uD1A0\uB7A9": { id: 62, categoryId: 5, logoUrl: "" },
  // 9. 차/밀크티 카테고리
  "\uACF5\uCC28": { id: 63, categoryId: 9, logoUrl: "" },
  "\uD314\uACF5\uD2F0": { id: 64, categoryId: 9, logoUrl: "" },
  "\uB530\uC090\uC624": { id: 65, categoryId: 9, logoUrl: "" },
  "\uB2EC\uCF64": { id: 66, categoryId: 9, logoUrl: "" },
  // 10. 와플/토스트 카테고리
  "\uC640\uD50C\uB300\uD559": { id: 67, categoryId: 10, logoUrl: "" },
  "\uBCA0\uB7EC\uB304\uC640\uD50C": { id: 68, categoryId: 10, logoUrl: "" },
  "\uC640\uD50C\uCE78": { id: 69, categoryId: 10, logoUrl: "" },
  // 11. 밀키트 카테고리
  "CJ \uCFE1\uD0B7": { id: 70, categoryId: 11, logoUrl: "" },
  "GS \uB9AC\uD14C\uC77C \uC2EC\uD50C\uB9AC\uCFE1": { id: 71, categoryId: 11, logoUrl: "" },
  "HY \uC787\uCE20\uC628": { id: 72, categoryId: 11, logoUrl: "" },
  "\uC2E0\uC138\uACC4\uD478\uB4DC \uD53C\uCF54\uD06C": { id: 73, categoryId: 11, logoUrl: "" },
  // 12. 스무디/주스 카테고리
  "\uC2A4\uBB34\uB514\uD0B9": { id: 74, categoryId: 12, logoUrl: "" },
  "\uB9C8\uC774\uC694\uAC70\uD2B8\uB9BD": { id: 75, categoryId: 12, logoUrl: "" },
  "\uC694\uAC70\uD504\uB808\uC18C": { id: 76, categoryId: 12, logoUrl: "" },
  "\uC544\uC784\uC77C\uB9AC\uD130": { id: 77, categoryId: 12, logoUrl: "" },
  // 13. 분식 카테고리
  "\uC1A1\uC0AC\uBD80\uC218\uC81C\uC300\uACE0\uB85C\uCF00": { id: 78, categoryId: 13, logoUrl: "" },
  "\uB9C8\uB9AC\uC6E8\uC77C237": { id: 79, categoryId: 13, logoUrl: "" },
  "\uCE04\uB7EC\uC2A41500": { id: 80, categoryId: 13, logoUrl: "" },
  // 15. 견과류 카테고리
  "\uCF54\uCF54\uD638\uB3C4": { id: 81, categoryId: 15, logoUrl: "" },
  "\uD638\uBC00\uD638\uB450": { id: 82, categoryId: 15, logoUrl: "" }
};
var franchises = Object.entries(franchiseMap).map(([name, data]) => ({
  id: data.id,
  name,
  categoryId: data.categoryId,
  logoUrl: data.logoUrl
}));
var cachedProducts = /* @__PURE__ */ new Map();
var initialized = false;
async function loadProductData() {
  if (initialized) {
    return Array.from(cachedProducts.values());
  }
  try {
    const franchiseDir = path.resolve("./seller/franchise");
    const franchiseFiles = fs.readdirSync(franchiseDir);
    let productId = 1;
    for (const franchiseFile of franchiseFiles) {
      if (!franchiseFile.endsWith(".json")) continue;
      const franchiseName = franchiseFile.replace(".json", "");
      const franchiseInfo = franchiseMap[franchiseName];
      if (!franchiseInfo) continue;
      const filePath = path.join(franchiseDir, franchiseFile);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const menuItems = JSON.parse(fileContent);
      console.log(`\uB85C\uB4DC \uC911: ${franchiseName} - ${menuItems.length}\uAC1C \uD56D\uBAA9`);
      for (const item of menuItems) {
        const nameParts = item.\uC2DD\uD488\uBA85.split("_");
        const productCategory = nameParts[0] || "";
        let productName;
        if (nameParts.length > 2 && nameParts[1] === "\uAC04\uD3B8\uC870\uB9AC\uC138\uD2B8") {
          productName = nameParts[2];
        } else {
          productName = nameParts.length > 1 ? nameParts[1] : item.\uC2DD\uD488\uBA85;
        }
        let categoryId = franchiseInfo.categoryId;
        if (productCategory.includes("\uBC84\uAC70") || productName.toLowerCase().includes("\uBC84\uAC70") || productName.toLowerCase().includes("\uC640\uD37C") || productName.toLowerCase().includes("\uBD88\uACE0\uAE30") || franchiseName === "KFC") {
          categoryId = 1;
        } else if (productCategory.includes("\uCE58\uD0A8") || productName.toLowerCase().includes("\uCE58\uD0A8") || productName.toLowerCase().includes("\uC719") || productName.toLowerCase().includes("\uBD09")) {
          categoryId = 2;
        } else if (productCategory.includes("\uD53C\uC790") || productName.toLowerCase().includes("\uD53C\uC790")) {
          categoryId = 3;
        } else if (productCategory.includes("\uCEE4\uD53C") || productCategory.includes("\uC74C\uB8CC") || productName.toLowerCase().includes("\uCEE4\uD53C") || productName.toLowerCase().includes("\uB77C\uB5BC") || productName.toLowerCase().includes("\uC5D0\uC2A4\uD504\uB808\uC18C") || productName.toLowerCase().includes("\uC544\uBA54\uB9AC\uCE74\uB178")) {
          categoryId = 4;
        } else if (productCategory.includes("\uB514\uC800\uD2B8") || productCategory.includes("\uCF00\uC774\uD06C") || productName.toLowerCase().includes("\uCF00\uC774\uD06C") || productName.toLowerCase().includes("\uCFE0\uD0A4") || productName.toLowerCase().includes("\uB9C8\uCE74\uB871") || productName.toLowerCase().includes("\uBE75") || productName.toLowerCase().includes("\uD398\uC774\uC2A4\uD2B8\uB9AC") || productName.toLowerCase().includes("\uD06C\uB9BC") || productName.toLowerCase().includes("\uD2F0\uB77C\uBBF8\uC218") || productName.toLowerCase().includes("\uC544\uC774\uC2A4\uD06C\uB9BC")) {
          categoryId = 5;
        } else if (productCategory.includes("\uAD6D") || productCategory.includes("\uCC0C\uAC1C") || productCategory.includes("\uBE44\uBE54\uBC25") || productName.toLowerCase().includes("\uBE44\uBE54\uBC25") || productName.toLowerCase().includes("\uAE40\uCE58") || productName.toLowerCase().includes("\uB41C\uC7A5") || productName.toLowerCase().includes("\uCC0C\uAC1C") || productName.toLowerCase().includes("\uAD6D\uBC25")) {
          categoryId = 6;
        } else if (productCategory.includes("\uCD08\uBC25") || productCategory.includes("\uC6B0\uB3D9") || productName.toLowerCase().includes("\uCD08\uBC25") || productName.toLowerCase().includes("\uC2A4\uC2DC") || productName.toLowerCase().includes("\uC6B0\uB3D9") || productName.toLowerCase().includes("\uB3C8\uAE4C\uC2A4")) {
          categoryId = 7;
        } else if (productCategory.includes("\uC9DC\uC7A5") || productCategory.includes("\uC9EC\uBF55") || productName.toLowerCase().includes("\uC9DC\uC7A5") || productName.toLowerCase().includes("\uC9EC\uBF55") || productName.toLowerCase().includes("\uD0D5\uC218\uC721")) {
          categoryId = 8;
        } else if (productCategory.includes("\uCC28") || productCategory.includes("\uD2F0") || productName.toLowerCase().includes("\uBC00\uD06C\uD2F0") || productName.toLowerCase().includes("\uBC84\uBE14\uD2F0") || productName.toLowerCase().includes("\uB179\uCC28") || productName.toLowerCase().includes("\uD64D\uCC28")) {
          categoryId = 9;
        } else if (productCategory.includes("\uC640\uD50C") || productCategory.includes("\uD1A0\uC2A4\uD2B8") || productName.toLowerCase().includes("\uC640\uD50C") || productName.toLowerCase().includes("\uD1A0\uC2A4\uD2B8")) {
          categoryId = 10;
        } else if (productCategory.includes("\uBC00\uD0A4\uD2B8") || productName.toLowerCase().includes("\uBC00\uD0A4\uD2B8") || productName.toLowerCase().includes("\uCFE1\uD0B7") || franchiseName.includes("\uCFE1\uD0B7") || franchiseName.includes("\uC2EC\uD50C\uB9AC\uCFE1") || franchiseName.includes("\uC787\uCE20\uC628") || franchiseName.includes("\uD53C\uCF54\uD06C")) {
          categoryId = 11;
        } else if (productCategory.includes("\uC2A4\uBB34\uB514") || productCategory.includes("\uC8FC\uC2A4") || productName.toLowerCase().includes("\uC2A4\uBB34\uB514") || productName.toLowerCase().includes("\uC8FC\uC2A4") || productName.toLowerCase().includes("\uC694\uAC70\uD2B8")) {
          categoryId = 12;
        } else if (productCategory.includes("\uB5A1\uBCF6\uC774") || productCategory.includes("\uACE0\uB85C\uCF00") || productName.toLowerCase().includes("\uB5A1\uBCF6\uC774") || productName.toLowerCase().includes("\uACE0\uB85C\uCF00") || productName.toLowerCase().includes("\uD56B\uB3C4\uADF8") || productName.toLowerCase().includes("\uAE40\uBC25")) {
          categoryId = 13;
        } else if (productCategory.includes("\uD30C\uC2A4\uD0C0") || productCategory.includes("\uC2A4\uD14C\uC774\uD06C") || productName.toLowerCase().includes("\uD30C\uC2A4\uD0C0") || productName.toLowerCase().includes("\uC2A4\uD14C\uC774\uD06C") || productName.toLowerCase().includes("\uB9AC\uC870\uB610")) {
          categoryId = 14;
        } else if (productCategory.includes("\uD638\uB450") || productCategory.includes("\uB545\uCF69") || productName.toLowerCase().includes("\uD638\uB450") || productName.toLowerCase().includes("\uB545\uCF69") || productName.toLowerCase().includes("\uACAC\uACFC")) {
          categoryId = 15;
        }
        let imageUrl = "";
        const allergenIds = [];
        if (productCategory.includes("\uBC84\uAC70") || productCategory.includes("\uC0CC\uB4DC\uC704\uCE58")) {
          allergenIds.push(1, 2, 8);
        }
        if (productName.toLowerCase().includes("\uCE58\uC988")) {
          allergenIds.push(2);
        }
        if (productName.toLowerCase().includes("\uC5D0\uADF8")) {
          allergenIds.push(3);
        }
        const uniqueAllergens = Array.from(new Set(allergenIds));
        let productWeight = 0;
        switch (categoryId) {
          case 1:
            productWeight = 250;
            break;
          case 2:
            productWeight = 200;
            break;
          case 3:
            productWeight = 300;
            break;
          case 4:
            productWeight = 350;
            break;
          case 5:
            productWeight = 120;
            break;
          default:
            if (productName.includes("\uC0CC\uB4DC\uC704\uCE58")) {
              productWeight = 220;
            } else if (productName.includes("\uBC84\uAC70")) {
              productWeight = 250;
            } else if (productName.includes("\uBCF6\uC74C\uBC25")) {
              productWeight = 300;
            } else if (productName.includes("\uCE58\uD0A8")) {
              productWeight = 200;
            } else {
              productWeight = 200;
            }
        }
        if (franchiseName === "\uAD50\uCD0C\uCE58\uD0A8" && productName.includes("\uB2EC\uAC40\uB4EC\uBFCD \uBCF6\uC74C\uBC25")) {
          productWeight = 400;
        } else if (franchiseName === "\uAD50\uCD0C\uCE58\uD0A8" && productName.includes("\uB2ED\uAC08\uBE44 \uBCF6\uC74C\uBC25")) {
          productWeight = 400;
        } else if (franchiseName === "\uAD50\uCD0C\uCE58\uD0A8" && productName.includes("\uC758\uC131\uB9C8\uB298 \uBCF6\uC74C\uBC25")) {
          productWeight = 400;
        } else if (franchiseName === "\uB9D8\uC2A4\uD130\uCE58" && productName.includes("\uAC04\uC7A5\uB9C8\uB298\uC2F8\uC774 \uBC84\uAC70")) {
          productWeight = 250;
        }
        let totalFat = Number(item["\uC9C0\uBC29(g)"]) || 0;
        const saturatedFat = item["\uD3EC\uD654\uC9C0\uBC29\uC0B0(g)"] ? Number(item["\uD3EC\uD654\uC9C0\uBC29\uC0B0(g)"]) : null;
        if ((!totalFat || isNaN(totalFat)) && saturatedFat) {
          totalFat = Math.round(saturatedFat * 2 * 10) / 10;
        }
        const caloriesTotal = Number(item["\uC5D0\uB108\uC9C0(kcal)"]) || 0;
        const proteinTotal = Number(item["\uB2E8\uBC31\uC9C8(g)"]) || 0;
        const carbsTotal = item["\uD0C4\uC218\uD654\uBB3C(g)"] ? Number(item["\uD0C4\uC218\uD654\uBB3C(g)"]) : 0;
        const fatTotal = totalFat;
        const saturatedFatTotal = saturatedFat;
        const transFatTotal = item["\uD2B8\uB79C\uC2A4\uC9C0\uBC29\uC0B0(g)"] ? Number(item["\uD2B8\uB79C\uC2A4\uC9C0\uBC29\uC0B0(g)"]) : null;
        const cholesterolTotal = item["\uCF5C\uB808\uC2A4\uD14C\uB864(mg)"] ? Number(item["\uCF5C\uB808\uC2A4\uD14C\uB864(mg)"]) : null;
        const sodiumTotal = item["\uB098\uD2B8\uB968(mg)"] ? Number(item["\uB098\uD2B8\uB968(mg)"]) : null;
        const sugarTotal = item["\uB2F9\uB958(g)"] ? Number(item["\uB2F9\uB958(g)"]) : null;
        let extractedWeight = null;
        if (franchiseName === "\uB9D8\uC2A4\uD130\uCE58" && productName.includes("\uAC04\uC7A5\uB9C8\uB298\uC2F8\uC774 \uBC84\uAC70")) {
          extractedWeight = 250;
        } else if (franchiseName === "\uAD50\uCD0C\uCE58\uD0A8" && (productName.includes("\uB2EC\uAC40\uB4EC\uBFCD \uBCF6\uC74C\uBC25") || productName.includes("\uB2ED\uAC08\uBE44 \uBCF6\uC74C\uBC25") || productName.includes("\uC758\uC131\uB9C8\uB298 \uBCF6\uC74C\uBC25"))) {
          extractedWeight = 400;
        }
        if (!extractedWeight) {
          if (typeof item["\uC2DD\uD488\uC911\uB7C9"] === "string") {
            const weightMatch = item["\uC2DD\uD488\uC911\uB7C9"].match(/(\d+)g/i);
            if (weightMatch) {
              extractedWeight = parseInt(weightMatch[1]);
              console.log(`\uC911\uB7C9 \uCD94\uCD9C \uC131\uACF5 (\uC2DD\uD488\uC911\uB7C9): ${productName} - ${extractedWeight}g`);
            }
          }
          if (!extractedWeight) {
            const weightMatch = productName.match(/(\d+)g/i) || JSON.stringify(item).match(/중량[:\s]*(\d+)g/i) || JSON.stringify(item).match(/무게[:\s]*(\d+)g/i) || item["\uC601\uC591\uC131\uBD84\uD568\uB7C9\uAE30\uC900\uB7C9"]?.match(/(\d+)g/i);
            if (weightMatch) {
              extractedWeight = parseInt(weightMatch[1]);
              console.log(`\uC911\uB7C9 \uCD94\uCD9C \uC131\uACF5 (\uAE30\uD0C0): ${productName} - ${extractedWeight}g`);
            }
          }
        }
        const description = extractedWeight ? `${franchiseName}\uC758 ${productName} \uBA54\uB274\uC785\uB2C8\uB2E4. (\uC601\uC591\uC131\uBD84: \uC804\uCCB4 ${extractedWeight}g \uAE30\uC900)` : `${franchiseName}\uC758 ${productName} \uBA54\uB274\uC785\uB2C8\uB2E4. (\uC601\uC591\uC131\uBD84: 100g \uAE30\uC900)`;
        const product = {
          id: productId++,
          name: productName,
          franchiseId: franchiseInfo.id,
          description,
          weight: extractedWeight,
          // 추출된 중량 정보 저장
          imageUrl,
          categoryId,
          // 자동 분류된 카테고리 ID 설정
          calories: caloriesTotal || 0,
          protein: proteinTotal || 0,
          carbs: carbsTotal || 0,
          fat: fatTotal || 0,
          saturatedFat: saturatedFatTotal,
          transFat: transFatTotal,
          cholesterol: cholesterolTotal,
          sodium: sodiumTotal,
          fiber: null,
          sugar: sugarTotal,
          calcium: null,
          iron: null,
          vitaminD: null,
          allergens: uniqueAllergens.length > 0 ? uniqueAllergens : null,
          featuredProduct: false
          // 기본값으로 설정
        };
        if (productName.includes("\uBE45\uB9E5") || productName.includes("\uC640\uD37C") || productName.includes("\uBD88\uACE0\uAE30") || productName.includes("\uC624\uB9AC\uC9C0\uB110")) {
          product.featuredProduct = true;
        }
        cachedProducts.set(product.id, product);
        console.log(`\uC81C\uD488 \uCD94\uAC00\uB428: ${product.name} (${franchiseName})`);
      }
    }
    const mamstouchFranchise = franchises.find((f) => f.name === "\uB9D8\uC2A4\uD130\uCE58");
    if (mamstouchFranchise) {
      const soyGarlicSighBurger = {
        id: productId++,
        name: "\uAC04\uC7A5\uB9C8\uB298\uC2F8\uC774 \uBC84\uAC70",
        franchiseId: mamstouchFranchise.id,
        categoryId: 1,
        // 버거 카테고리
        description: "\uB9D8\uC2A4\uD130\uCE58\uC758 \uAC04\uC7A5\uB9C8\uB298\uC2F8\uC774 \uBC84\uAC70 \uBA54\uB274\uC785\uB2C8\uB2E4. (\uC601\uC591\uC131\uBD84: \uC804\uCCB4 250g \uAE30\uC900)",
        weight: 250,
        // 250g으로 설정
        imageUrl: "",
        calories: 289,
        protein: 14.07,
        carbs: 19.01,
        fat: 17.38,
        saturatedFat: 4.94,
        transFat: 0.19,
        cholesterol: 37.26,
        sodium: 511,
        fiber: null,
        sugar: 3.8,
        calcium: null,
        iron: null,
        vitaminD: null,
        allergens: [1, 2, 8],
        // 밀, 유제품, 대두
        featuredProduct: true
      };
      cachedProducts.set(soyGarlicSighBurger.id, soyGarlicSighBurger);
      console.log(`\uD2B9\uC218 \uC81C\uD488 \uCD94\uAC00\uB428: ${soyGarlicSighBurger.name} (\uB9D8\uC2A4\uD130\uCE58)`);
    }
    console.log(`\uCD1D ${cachedProducts.size}\uAC1C \uC81C\uD488 \uB85C\uB4DC \uC644\uB8CC`);
    initialized = true;
    return Array.from(cachedProducts.values());
  } catch (error) {
    console.error("\uC81C\uD488 \uB370\uC774\uD130 \uB85C\uB4DC \uC911 \uC624\uB958 \uBC1C\uC0DD:", error);
    return [];
  }
}
function initializeData() {
  loadProductData().then(() => console.log("\uB370\uC774\uD130 \uCD08\uAE30\uD654 \uC644\uB8CC")).catch((error) => console.error("\uB370\uC774\uD130 \uCD08\uAE30\uD654 \uC2E4\uD328:", error));
}
function getCategories() {
  return categories;
}
function getFranchises() {
  return franchises;
}
function getAllergens() {
  return allergens;
}

// server/storage.ts
var MemStorage = class {
  users;
  _categories;
  _franchises;
  _allergens;
  _products;
  currentUserId;
  currentCategoryId;
  currentFranchiseId;
  currentAllergenId;
  currentProductId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this._categories = /* @__PURE__ */ new Map();
    this._franchises = /* @__PURE__ */ new Map();
    this._allergens = /* @__PURE__ */ new Map();
    this._products = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentFranchiseId = 1;
    this.currentAllergenId = 1;
    this.currentProductId = 1;
    this.initializeData();
    initializeData();
  }
  // User methods (keep for reference)
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Category methods
  async getCategories() {
    return Array.from(this._categories.values());
  }
  async getCategory(id) {
    return this._categories.get(id);
  }
  async createCategory(insertCategory) {
    const id = this.currentCategoryId++;
    const category = { ...insertCategory, id };
    this._categories.set(id, category);
    return category;
  }
  // Franchise methods
  async getFranchises() {
    return Array.from(this._franchises.values());
  }
  async getFranchise(id) {
    return this._franchises.get(id);
  }
  async getFranchisesByCategory(categoryId) {
    return Array.from(this._franchises.values()).filter(
      (franchise) => franchise.categoryId === categoryId
    );
  }
  async createFranchise(insertFranchise) {
    const id = this.currentFranchiseId++;
    const franchise = { ...insertFranchise, id };
    this._franchises.set(id, franchise);
    return franchise;
  }
  // Allergen methods
  async getAllergens() {
    return Array.from(this._allergens.values());
  }
  async getAllergen(id) {
    return this._allergens.get(id);
  }
  async createAllergen(insertAllergen) {
    const id = this.currentAllergenId++;
    const allergen = { ...insertAllergen, id };
    this._allergens.set(id, allergen);
    return allergen;
  }
  // Product methods
  async getProducts() {
    return Array.from(this._products.values());
  }
  async getProduct(id) {
    return this._products.get(id);
  }
  async getProductsByFranchise(franchiseId) {
    return Array.from(this._products.values()).filter(
      (product) => product.franchiseId === franchiseId
    );
  }
  async createProduct(insertProduct) {
    const id = this.currentProductId++;
    const normalizedAllergens = insertProduct.allergens && Array.isArray(insertProduct.allergens) ? [...insertProduct.allergens] : null;
    const product = {
      // 먼저 원래 insertProduct에서 allergens 제거 (명시적으로 처리)
      name: insertProduct.name,
      franchiseId: insertProduct.franchiseId,
      categoryId: insertProduct.categoryId || null,
      imageUrl: insertProduct.imageUrl,
      calories: insertProduct.calories,
      protein: insertProduct.protein,
      carbs: insertProduct.carbs,
      fat: insertProduct.fat,
      // 나머지 필드는 null 값이 허용됨
      id,
      description: insertProduct.description || null,
      saturatedFat: insertProduct.saturatedFat || null,
      transFat: insertProduct.transFat || null,
      cholesterol: insertProduct.cholesterol || null,
      sodium: insertProduct.sodium || null,
      fiber: insertProduct.fiber || null,
      sugar: insertProduct.sugar || null,
      calcium: insertProduct.calcium || null,
      iron: insertProduct.iron || null,
      vitaminD: insertProduct.vitaminD || null,
      allergens: normalizedAllergens,
      featuredProduct: insertProduct.featuredProduct !== void 0 ? insertProduct.featuredProduct : false,
      weight: insertProduct.weight || null
    };
    this._products.set(id, product);
    return product;
  }
  async searchProducts(params) {
    let results = Array.from(this._products.values());
    if (params.query) {
      const queryLower = params.query.toLowerCase();
      const categoryMatches = Array.from(this._categories.values()).filter(
        (category) => category.name.toLowerCase() === queryLower || category.nameKorean.toLowerCase() === queryLower || category.name.toLowerCase().includes(queryLower) && queryLower.length > 1 || category.nameKorean.toLowerCase().includes(queryLower) && queryLower.length > 1
      );
      if (categoryMatches.length > 0) {
        const matchingCategoryIds = categoryMatches.map((c) => c.id);
        const categoryResults = results.filter(
          (product) => product.categoryId ? matchingCategoryIds.includes(product.categoryId) : false
        );
        if (categoryResults.length > 0) {
          const categoryAndNameMatches = categoryResults.filter(
            (product) => product.name.toLowerCase().includes(queryLower)
          );
          if (categoryAndNameMatches.length > 0) {
            return categoryAndNameMatches;
          }
          return categoryResults;
        }
      }
      const franchiseMatches = Array.from(this._franchises.values()).filter(
        (franchise) => franchise.name.toLowerCase() === queryLower || // 정확한 일치
        franchise.name.toLowerCase().includes(queryLower) && queryLower.length > 1
        // 포함 관계
      );
      if (franchiseMatches.length > 0) {
        const matchingFranchiseIds = franchiseMatches.map((f) => f.id);
        const franchiseResults = results.filter(
          (product) => matchingFranchiseIds.includes(product.franchiseId)
        );
        if (franchiseResults.length > 0) {
          return franchiseResults;
        }
      }
      const exactMatches = results.filter(
        (product) => product.name.toLowerCase() === queryLower
      );
      if (exactMatches.length > 0) {
        return exactMatches;
      }
      const fullQueryMatches = results.filter(
        (product) => product.name.toLowerCase().includes(queryLower)
      );
      if (fullQueryMatches.length > 0) {
        return fullQueryMatches;
      }
      const searchTokens = queryLower.split(/[\s-_]/).filter((token) => token.length > 1);
      if (searchTokens.length > 0) {
        const allTokenMatches = results.filter((product) => {
          const productNameLower = product.name.toLowerCase();
          return searchTokens.every((token) => productNameLower.includes(token));
        });
        if (allTokenMatches.length > 0) {
          return allTokenMatches;
        }
      }
      results = results.filter(
        (product) => product.name.toLowerCase().includes(queryLower) || product.description && product.description.toLowerCase().includes(queryLower)
      );
      if (results.length === 0) {
        const matchingCategories = Array.from(this._categories.values()).filter(
          (category) => category.name.toLowerCase() === queryLower || category.nameKorean.toLowerCase() === queryLower
        );
        const matchingCategoryIds = matchingCategories.map((category) => category.id);
        const matchingFranchiseIds = Array.from(this._franchises.values()).filter((franchise) => matchingCategoryIds.includes(franchise.categoryId)).map((franchise) => franchise.id);
        const franchisesMatchingQuery = Array.from(this._franchises.values()).filter((franchise) => franchise.name.toLowerCase() === queryLower).map((franchise) => franchise.id);
        const allMatchingFranchiseIds = Array.from(/* @__PURE__ */ new Set([...matchingFranchiseIds, ...franchisesMatchingQuery]));
        results = Array.from(this._products.values()).filter(
          (product) => (
            // 정확히 일치하는 카테고리나 프랜차이즈에 속한 제품만 포함
            allMatchingFranchiseIds.includes(product.franchiseId)
          )
        );
      }
    }
    if (params.franchiseId) {
      results = results.filter(
        (product) => product.franchiseId === params.franchiseId
      );
    }
    if (params.categoryId) {
      const directCategoryProducts = results.filter(
        (product) => product.categoryId === params.categoryId
      );
      const franchisesInCategory = Array.from(this._franchises.values()).filter((franchise) => franchise.categoryId === params.categoryId).map((franchise) => franchise.id);
      const franchiseCategoryProducts = results.filter(
        (product) => franchisesInCategory.includes(product.franchiseId)
      );
      const productIds = /* @__PURE__ */ new Set();
      const combinedResults = [];
      for (const product of [...directCategoryProducts, ...franchiseCategoryProducts]) {
        if (!productIds.has(product.id)) {
          productIds.add(product.id);
          combinedResults.push(product);
        }
      }
      results = combinedResults;
    }
    if (params.minCalories !== void 0) {
      results = results.filter((product) => product.calories >= params.minCalories);
    }
    if (params.maxCalories !== void 0) {
      results = results.filter((product) => product.calories <= params.maxCalories);
    }
    if (params.minProtein !== void 0) {
      results = results.filter((product) => product.protein >= params.minProtein);
    }
    if (params.maxProtein !== void 0) {
      results = results.filter((product) => product.protein <= params.maxProtein);
    }
    if (params.minCarbs !== void 0) {
      results = results.filter((product) => product.carbs >= params.minCarbs);
    }
    if (params.maxCarbs !== void 0) {
      results = results.filter((product) => product.carbs <= params.maxCarbs);
    }
    if (params.minFat !== void 0) {
      results = results.filter((product) => product.fat >= params.minFat);
    }
    if (params.maxFat !== void 0) {
      results = results.filter((product) => product.fat <= params.maxFat);
    }
    return results;
  }
  // Initialize data from data-loader
  async initializeData() {
    try {
      const allergenData = getAllergens();
      for (const allergen of allergenData) {
        const { id, ...insertData } = allergen;
        await this.createAllergen(insertData);
      }
      console.log("\uC54C\uB7EC\uC820 \uB370\uC774\uD130 \uB85C\uB4DC \uC644\uB8CC");
      const categoryData = getCategories();
      for (const category of categoryData) {
        const { id, ...insertData } = category;
        await this.createCategory(insertData);
      }
      console.log("\uCE74\uD14C\uACE0\uB9AC \uB370\uC774\uD130 \uB85C\uB4DC \uC644\uB8CC");
      const franchiseData = getFranchises();
      for (const franchise of franchiseData) {
        const { id, ...insertData } = franchise;
        await this.createFranchise(insertData);
      }
      console.log("\uD504\uB79C\uCC28\uC774\uC988 \uB370\uC774\uD130 \uB85C\uB4DC \uC644\uB8CC");
      const products = await loadProductData();
      for (const product of products) {
        const { id, ...insertData } = product;
        if (!this._products.has(id)) {
          await this.createProduct(insertData);
        }
      }
      console.log(`\uCD1D ${this._products.size}\uAC1C \uC81C\uD488 \uB85C\uB4DC \uC644\uB8CC`);
    } catch (error) {
      console.error("\uB370\uC774\uD130 \uCD08\uAE30\uD654 \uC911 \uC624\uB958 \uBC1C\uC0DD:", error);
    }
  }
};
var storage = new MemStorage();

// server/routes.ts
async function registerRoutes(app2) {
  const apiRouter = app2.route("/api");
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Failed to fetch category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  app2.get("/api/franchises", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : void 0;
      if (categoryId) {
        if (isNaN(categoryId)) {
          return res.status(400).json({ message: "Invalid category ID" });
        }
        const franchises3 = await storage.getFranchisesByCategory(categoryId);
        return res.json(franchises3);
      }
      const franchises2 = await storage.getFranchises();
      res.json(franchises2);
    } catch (error) {
      console.error("Failed to fetch franchises:", error);
      res.status(500).json({ message: "Failed to fetch franchises" });
    }
  });
  app2.get("/api/franchises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid franchise ID" });
      }
      const franchise = await storage.getFranchise(id);
      if (!franchise) {
        return res.status(404).json({ message: "Franchise not found" });
      }
      res.json(franchise);
    } catch (error) {
      console.error("Failed to fetch franchise:", error);
      res.status(500).json({ message: "Failed to fetch franchise" });
    }
  });
  app2.get("/api/allergens", async (req, res) => {
    try {
      const allergens2 = await storage.getAllergens();
      res.json(allergens2);
    } catch (error) {
      console.error("Failed to fetch allergens:", error);
      res.status(500).json({ message: "Failed to fetch allergens" });
    }
  });
  app2.get("/api/allergens/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid allergen ID" });
      }
      const allergen = await storage.getAllergen(id);
      if (!allergen) {
        return res.status(404).json({ message: "Allergen not found" });
      }
      res.json(allergen);
    } catch (error) {
      console.error("Failed to fetch allergen:", error);
      res.status(500).json({ message: "Failed to fetch allergen" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const franchiseId = req.query.franchiseId ? parseInt(req.query.franchiseId) : void 0;
      if (franchiseId) {
        if (isNaN(franchiseId)) {
          return res.status(400).json({ message: "Invalid franchise ID" });
        }
        const products2 = await storage.getProductsByFranchise(franchiseId);
        return res.json(products2);
      }
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.allergens && Array.isArray(product.allergens)) {
        const allergenPromises = product.allergens.map((id2) => storage.getAllergen(id2));
        const allergenObjects = await Promise.all(allergenPromises);
        const response = {
          ...product,
          allergenDetails: allergenObjects.filter((a) => a !== void 0)
        };
        return res.json(response);
      }
      res.json(product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      console.log("Search API called with params:", req.query);
      const searchParams = {
        query: req.query.q || req.query.query,
        // q 파라미터 지원 (프론트엔드에서 q로 보내는 경우)
        franchiseId: req.query.franchiseId ? parseInt(req.query.franchiseId) : void 0,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : void 0
      };
      console.log("Parsed search params:", searchParams);
      const parsedParams = { ...searchParams };
      if (req.query.calorieRange) {
        const calorieRange = req.query.calorieRange;
        if (!isNaN(Number(calorieRange)) && Number(calorieRange) > 0) {
          parsedParams.maxCalories = Number(calorieRange);
        } else if (calorieRange === "0-300") {
          parsedParams.maxCalories = 300;
        } else if (calorieRange === "300-500") {
          parsedParams.minCalories = 300;
          parsedParams.maxCalories = 500;
        } else if (calorieRange === "500-800") {
          parsedParams.minCalories = 500;
          parsedParams.maxCalories = 800;
        } else if (calorieRange === "800+") {
          parsedParams.minCalories = 800;
        }
      }
      if (req.query.proteinRange) {
        const proteinRange = req.query.proteinRange;
        if (!isNaN(Number(proteinRange)) && Number(proteinRange) > 0) {
          parsedParams.minProtein = Number(proteinRange);
        } else if (proteinRange === "0-10") {
          parsedParams.maxProtein = 10;
        } else if (proteinRange === "10-20") {
          parsedParams.minProtein = 10;
          parsedParams.maxProtein = 20;
        } else if (proteinRange === "20-30") {
          parsedParams.minProtein = 20;
          parsedParams.maxProtein = 30;
        } else if (proteinRange === "30+") {
          parsedParams.minProtein = 30;
        }
      }
      if (req.query.carbsRange) {
        const carbsRange = req.query.carbsRange;
        if (!isNaN(Number(carbsRange)) && Number(carbsRange) > 0) {
          parsedParams.maxCarbs = Number(carbsRange);
        } else if (carbsRange === "0-30") {
          parsedParams.maxCarbs = 30;
        } else if (carbsRange === "30-60") {
          parsedParams.minCarbs = 30;
          parsedParams.maxCarbs = 60;
        } else if (carbsRange === "60-90") {
          parsedParams.minCarbs = 60;
          parsedParams.maxCarbs = 90;
        } else if (carbsRange === "90+") {
          parsedParams.minCarbs = 90;
        }
      }
      if (req.query.fatRange) {
        const fatRange = req.query.fatRange;
        if (!isNaN(Number(fatRange)) && Number(fatRange) > 0) {
          parsedParams.maxFat = Number(fatRange);
        } else if (fatRange === "0-10") {
          parsedParams.maxFat = 10;
        } else if (fatRange === "10-20") {
          parsedParams.minFat = 10;
          parsedParams.maxFat = 20;
        } else if (fatRange === "20-30") {
          parsedParams.minFat = 20;
          parsedParams.maxFat = 30;
        } else if (fatRange === "30+") {
          parsedParams.minFat = 30;
        }
      }
      const products = await storage.searchProducts(parsedParams);
      res.json(products);
    } catch (error) {
      console.error("Search failed:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/franchise-loader.ts
import * as fs3 from "fs";
import * as path4 from "path";
async function loadFranchiseData() {
  try {
    const franchiseDir = path4.join(process.cwd(), "seller/franchise");
    if (!fs3.existsSync(franchiseDir)) {
      console.error("seller/franchise \uB514\uB809\uD1A0\uB9AC\uAC00 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
      return;
    }
    const franchises2 = await storage.getFranchises();
    for (const franchise of franchises2) {
      const franchiseFileName = `${franchise.name}.json`;
      const franchiseFilePath = path4.join(franchiseDir, franchiseFileName);
      if (fs3.existsSync(franchiseFilePath)) {
        try {
          console.log(`${franchise.name} \uB370\uC774\uD130 \uB85C\uB4DC \uC911...`);
          const franchiseData = JSON.parse(fs3.readFileSync(franchiseFilePath, "utf8"));
          for (const item of franchiseData.slice(0, 20)) {
            try {
              const productData = {
                name: item.\uC2DD\uD488\uBA85?.replace(/^버거_|^피자_|^치킨_|^디저트_|^커피_|^음료_/g, "") || "\uC54C \uC218 \uC5C6\uC74C",
                franchiseId: franchise.id,
                description: `${franchise.name}\uC758 ${item.\uC2DD\uD488\uBA85?.replace(/^버거_|^피자_|^치킨_|^디저트_|^커피_|^음료_/g, "") || "\uC54C \uC218 \uC5C6\uC74C"} \uBA54\uB274\uC785\uB2C8\uB2E4.`,
                imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500",
                // 기본 이미지
                calories: Math.round(parseFloat(item["\uC5D0\uB108\uC9C0(kcal)"] || "0")),
                protein: Math.round(parseFloat(item["\uB2E8\uBC31\uC9C8(g)"] || "0")),
                carbs: Math.round(parseFloat(item["\uD0C4\uC218\uD654\uBB3C(g)"] || "0")),
                fat: Math.round(parseFloat(item["\uC9C0\uBC29(g)"] || "0")),
                saturatedFat: Math.round(parseFloat(item["\uD3EC\uD654\uC9C0\uBC29(g)"] || "0")),
                transFat: Math.round(parseFloat(item["\uD2B8\uB79C\uC2A4\uC9C0\uBC29(g)"] || "0")),
                cholesterol: Math.round(parseFloat(item["\uCF5C\uB808\uC2A4\uD14C\uB864(mg)"] || "0")),
                sodium: Math.round(parseFloat(item["\uB098\uD2B8\uB968(mg)"] || "0")),
                fiber: Math.round(parseFloat(item["\uC2DD\uC774\uC12C\uC720(g)"] || "0")),
                sugar: Math.round(parseFloat(item["\uB2F9\uB958(g)"] || "0")),
                calcium: Math.round(parseFloat(item["\uCE7C\uC298(mg)"] || "0")),
                iron: Math.round(parseFloat(item["\uCCA0(mg)"] || "0")),
                vitaminD: Math.round(parseFloat(item["\uBE44\uD0C0\uBBFCD(\xB5g)"] || "0")),
                allergens: [1, 2],
                // 기본 알러젠 (임시)
                featuredProduct: Math.random() > 0.8
                // 20% 확률로 featured 제품으로 설정
              };
              const existingProducts = await storage.getProductsByFranchise(franchise.id);
              const exists = existingProducts.some((p) => p.name === productData.name);
              if (!exists) {
                await storage.createProduct(productData);
                console.log(`\uC81C\uD488 \uCD94\uAC00\uB428: ${productData.name} (${franchise.name})`);
              } else {
                console.log(`\uC81C\uD488 \uC774\uBBF8 \uC874\uC7AC\uD568: ${productData.name} (${franchise.name})`);
              }
            } catch (err) {
              const itemError = err;
              console.error(`\uC544\uC774\uD15C \uCC98\uB9AC \uC911 \uC624\uB958: ${itemError.message}`);
            }
          }
        } catch (err) {
          const fileError = err;
          console.error(`\uD30C\uC77C \uCC98\uB9AC \uC911 \uC624\uB958: ${franchiseFileName}: ${fileError.message}`);
        }
      } else {
        console.log(`${franchiseFileName} \uD30C\uC77C\uC774 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.`);
      }
    }
    console.log("\uBAA8\uB4E0 \uD504\uB79C\uCC28\uC774\uC988 \uB370\uC774\uD130 \uB85C\uB4DC \uC644\uB8CC!");
  } catch (error) {
    console.error("\uD504\uB79C\uCC28\uC774\uC988 \uB370\uC774\uD130 \uB85C\uB4DC \uC911 \uC624\uB958:", error);
  }
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  loadFranchiseData().catch((err) => {
    console.error("\uD504\uB79C\uCC28\uC774\uC988 \uB370\uC774\uD130 \uB85C\uB4DC \uC624\uB958:", err);
  });
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 3e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
