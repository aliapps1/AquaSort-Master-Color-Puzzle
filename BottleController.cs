using System.Collections.Generic;
using UnityEngine;

public class BottleController : MonoBehaviour
{
    [Header("Bottle Logic")]
    public List<Color> layers = new List<Color>(); // لیست رنگ‌های لایه‌های آب
    public int maxLayers = 4; // حداکثر ظرفیت بطری

    [Header("Visual Connection")]
    private WaterShaderController visualController;

    void Awake()
    {
        // پیدا کردن اسکریپت گرافیکی روی همین شیء
        visualController = GetComponent<WaterShaderController>();
    }

    void Start()
    {
        UpdateVisuals();
    }

    // متد برای گرفتن رنگ بالاترین لایه
    public Color GetTopColor()
    {
        if (layers.Count > 0)
            return layers[layers.Count - 1];
        return Color.clear;
    }

    // آیا می‌توان از این بطری آب برداشت؟
    public bool CanExtract()
    {
        return layers.Count > 0;
    }

    // آیا می‌توان در این بطری آب ریخت؟
    public bool CanFill(Color incomingColor)
    {
        if (layers.Count == 0) return true; // بطری خالی است
        if (layers.Count >= maxLayers) return false; // بطری پر است
        return GetTopColor() == incomingColor; // رنگ‌ها باید یکی باشند
    }

    // متد برداشتن رنگ (پاپ کردن)
    public Color PopColor()
    {
        Color topColor = GetTopColor();
        layers.RemoveAt(layers.Count - 1);
        
        UpdateVisuals(); // فراخوانی گرافیک برای حذف لایه
        return topColor;
    }

    // متد اضافه کردن رنگ
    public void AddColor(Color newColor)
    {
        if (layers.Count < maxLayers)
        {
            layers.Add(newColor);
            UpdateVisuals(); // فراخوانی گرافیک برای رسم لایه جدید
        }
    }

    // هماهنگی با بخش گرافیکی
    public void UpdateVisuals()
    {
        if (visualController != null)
        {
            visualController.RefreshVisuals();
        }
    }

    // بررسی اینکه آیا این بطری به طور کامل حل شده است؟
    public bool IsSolved()
    {
        if (layers.Count == 0) return true; // بطری خالی به عنوان حل شده فرض می‌شود
        if (layers.Count != maxLayers) return false; // بطری نیمه‌پر حل شده نیست

        Color firstColor = layers[0];
        foreach (var c in layers)
        {
            if (c != firstColor) return false; // اگر رنگی مخالف رنگ اول باشد
        }
        return true;
    }
}
