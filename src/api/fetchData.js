const baseUrl = 'https://api.vika.cn/fusion/v1/datasheets';
const fieldKey = 'name';
const DEFAULT_ICON_URL = '/default.ico';

export async function fetchData() {
  try {
    // 从localStorage读取API配置
    const apiKey = localStorage.getItem('apiKey');
    const datasheetId = localStorage.getItem('datasheetId');
    const viewId = localStorage.getItem('viewId');
    
    // 检查配置是否完整
    if (!apiKey || !datasheetId || !viewId) {
      throw new Error('API配置不完整，请前往设置页面配置');
    }
    
    // 动态构建API URL
    const apiUrl = `${baseUrl}/${datasheetId}/records?viewId=${viewId}&fieldKey=${fieldKey}&pageSize=1000`;
    
    const response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API请求失败:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error('API请求失败');
    }
    
    const responseData = await response.json();
    console.log('API返回数据:', responseData);
    
    if (!responseData || !responseData.data || !responseData.data.records || !Array.isArray(responseData.data.records)) {
      throw new Error(`返回数据格式不正确: ${JSON.stringify(responseData)}`);
    }
    
    return responseData.data.records.map(record => {
      if (!record.fields || !record.fields.category || !record.fields.name) {
        console.warn('缺少必填字段的记录:', record);
        return null;
      }
      return {
        id: record.recordId,
        category: record.fields.category,
        name: record.fields.name,
        url: record.fields.url,
        description: record.fields.description || '',
        icon: record.fields.icon || DEFAULT_ICON_URL,
        sortOrder: record.fields.order ? parseInt(record.fields.order) : 0,
      };
    }).filter(Boolean).sort((a, b) => b.sortOrder - a.sortOrder);  // 修改排序逻辑为降序
  } catch (error) {
    console.error('数据获取失败:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    // 抛出错误，让调用方处理
    throw error;
  }
}

// 添加网址到维格云表格
export async function addWebsite(websiteData) {
  try {
    // 从localStorage读取API配置
    const apiKey = localStorage.getItem('apiKey');
    const datasheetId = localStorage.getItem('datasheetId');
    
    // 检查配置是否完整
    if (!apiKey || !datasheetId) {
      throw new Error('API配置不完整，请前往设置页面配置');
    }
    
    // 动态构建API URL
    const apiUrl = `${baseUrl}/${datasheetId}/records`;
    
    // 构造请求体
    const requestBody = {
      records: [
        {
          fields: {
            category: websiteData.category,
            name: websiteData.name,
            url: websiteData.url,
            icon: websiteData.icon,
            description: websiteData.description,
            order: websiteData.order
          }
        }
      ]
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API请求失败:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error('API请求失败');
    }
    
    const responseData = await response.json();
    console.log('API返回数据:', responseData);
    
    if (!responseData || !responseData.data || !responseData.data.records || !Array.isArray(responseData.data.records)) {
      throw new Error(`返回数据格式不正确: ${JSON.stringify(responseData)}`);
    }
    
    return responseData.data.records[0];
  } catch (error) {
    console.error('数据提交失败:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    // 抛出错误，让调用方处理
    throw error;
  }
}