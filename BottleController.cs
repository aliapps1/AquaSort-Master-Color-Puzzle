using System.Collections.Generic;
using UnityEngine;

public class BottleController : MonoBehaviour
{
    public List<Color> layers = new List<Color>();
    public int maxLayers = 4;

    // متد جدید برای هماهنگی با GameManager
    public Color GetTopColor()
    {
        if (layers.Count > 0)
            return layers[layers.Count - 1];
        return Color.clear;
    }

    public bool CanExtract()
    {
        return layers.Count > 0;
    }

    public bool CanFill(Color incomingColor)
    {
        if (layers.Count == 0) return true;
        if (layers.Count >= maxLayers) return false;
        return GetTopColor() == incomingColor;
    }

    public Color PopColor()
    {
        Color topColor = GetTopColor();
        layers.RemoveAt(layers.Count - 1);
        UpdateVisuals();
        return topColor;
    }

    public void AddColor(Color newColor)
    {
        if (layers.Count < maxLayers)
        {
            layers.Add(newColor);
            UpdateVisuals();
        }
    }

    public void UpdateVisuals()
    {
        // در این بخش کدهای گرافیکی مربوط به آب قرار می‌گیرد
        // فعلاً برای تست در کنسول نمایش می‌دهیم
        Debug.Log(gameObject.name + " Updated. Layers: " + layers.Count);
    }

    public bool IsSolved()
    {
        if (layers.Count == 0) return true; // بطری خالی اوکی است
        if (layers.Count != maxLayers) return false;

        Color firstColor = layers[0];
        foreach (var c in layers)
        {
            if (c != firstColor) return false;
        }
        return true;
    }
}
