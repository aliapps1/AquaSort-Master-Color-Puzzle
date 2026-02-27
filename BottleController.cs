using System.Collections.Generic;
using UnityEngine;

public class BottleController : MonoBehaviour
{
    // لیست رنگ‌های موجود در این بطری (از پایین به بالا)
    public List<Color> layers = new List<Color>();
    public int maxLayers = 4; // ظرفیت استاندارد هر بطری

    [Header("Settings")]
    public Transform waterPrefab; // مدل بصری لایه‌های آب

    // بررسی اینکه آیا می‌توانیم از این بطری آب بریزیم؟
    public bool CanExtract()
    {
        return layers.Count > 0;
    }

    // بررسی اینکه آیا می‌توانیم در این بطری آب بریزیم؟
    public bool CanFill(Color incomingColor)
    {
        if (layers.Count == 0) return true; // بطری خالی است
        if (layers.Count >= maxLayers) return false; // بطری پر است
        return layers[layers.Count - 1] == incomingColor; // رنگ لایه آخر یکی باشد
    }

    // متد ریختن آب
    public Color PopColor()
    {
        Color topColor = layers[layers.Count - 1];
        layers.RemoveAt(layers.Count - 1);
        UpdateVisuals();
        return topColor;
    }

    public void AddColor(Color newColor)
    {
        layers.Add(newColor);
        UpdateVisuals();
    }

    // این بخش را بعداً با انیمیشن‌های گرافیکی پر می‌کنیم
    public void UpdateVisuals()
    {
        // در اینجا کد تغییر ظاهر بطری بر اساس تعداد لایه‌ها قرار می‌گیرد
        Debug.Log("Bottle Updated. Current Layers: " + layers.Count);
    }

    // بررسی اینکه آیا بطری تک‌رنگ و کامل است؟
    public bool IsSolved()
    {
        if (layers.Count == 0) return true;
        if (layers.Count != maxLayers) return false;

        Color firstColor = layers[0];
        foreach (var c in layers)
        {
            if (c != firstColor) return false;
        }
        return true;
    }
}
