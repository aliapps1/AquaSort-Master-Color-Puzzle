using UnityEngine;
using System.Collections.Generic;

public class WaterShaderController : MonoBehaviour
{
    private BottleController bottle;
    public GameObject waterLayerPrefab; // یک Sprite ساده که نقش لایه آب را دارد
    private List<GameObject> activeLayers = new List<GameObject>();

    void Start()
    {
        bottle = GetComponent<BottleController>();
        RefreshVisuals();
    }

    // این متد توسط BottleController صدا زده می‌شود
    public void RefreshVisuals()
    {
        // حذف لایه‌های قبلی برای رسم مجدد
        foreach (var layer in activeLayers)
        {
            Destroy(layer);
        }
        activeLayers.Clear();

        // رسم لایه‌ها از پایین به بالا
        for (int i = 0; i < bottle.layers.Count; i++)
        {
            GameObject newLayer = Instantiate(waterLayerPrefab, transform);
            
            // تنظیم موقعیت هر لایه (به صورت عمودی روی هم)
            float yOffset = i * 0.5f; // این عدد بسته به اندازه بطری شما تغییر می‌کند
            newLayer.transform.localPosition = new Vector3(0, yOffset - 1f, 0);
            
            // تنظیم رنگ لایه
            newLayer.GetComponent<SpriteRenderer>().color = bottle.layers[i];
            
            activeLayers.Add(newLayer);
        }
    }
}
