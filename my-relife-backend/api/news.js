// 這個檔案會由 Vercel 變成一個雲端函式，作為我們穩定可靠的代理。
export default async function handler(request, response) {
  // 我們的目標資料來源：衛福部 API
  const API_TARGET_URL = "https://www.mohw.gov.tw/openapi/json/news.aspx";

  try {
    // 在雲端伺服器上發出 fetch 請求，這裡沒有瀏覽器的 CORS 限制
    const apiResponse = await fetch(API_TARGET_URL);

    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }
    
    const data = await apiResponse.json();

    // 設定我們自己的 API 回應標頭，允許任何來源的前端來存取
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate'); // 設定快取
    
    // 成功！將從衛福部拿到的資料回傳給前端
    response.status(200).json(data);

  } catch (error) {
    console.error(error); // 在後台紀錄錯誤
    response.status(500).json({ error: "Failed to fetch data from the source API." });
  }
}