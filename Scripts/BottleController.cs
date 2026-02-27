using System.Collections.Generic;
using UnityEngine;

public class BottleController : MonoBehaviour
{
    [Header("Logic")]
    public List<Color> layers = new List<Color>();
    public int maxLayers = 4;

    [Header("Effects & Juice")]
    public ParticleSystem winParticles; // سیستم ذرات برای پیروزی
    public float selectOffset = 0.5f; // چقدر بطری بالا بپره
    private Vector3 originalPosition;
    private bool isSelected = false;

    void Start()
    {
        originalPosition = transform.position;
        UpdateVisuals();
    }

    // متد برای انیمیشن انتخاب و پرش بطری
    public void SetSelected(bool selected)
    {
        isSelected = selected;
        Vector3 targetPos = isSelected ? originalPosition + Vector3.up * selectOffset : originalPosition;
        transform.position = targetPos; // برای نرم‌تر شدن می‌تونی از iTween یا LeanTween استفاده کنی
        
        if(selected) {
            #if UNITY_ANDROID || UNITY_IOS
            Handheld.Vibrate(); // لرزش خفیف هنگام انتخاب
            #endif
        }
    }

    public void AddColor(Color newColor)
    {
        if (layers.Count < maxLayers)
        {
            layers.Add(newColor);
            UpdateVisuals();

            if (IsSolved() && layers.Count == maxLayers)
            {
                PlayWinEffect();
            }
        }
    }

    void PlayWinEffect()
    {
        if (winParticles != null) winParticles.Play();
        // اینجا می‌تونی کد پخش صدای "تشویق" رو هم بذاری
    }

    public Color PopColor()
    {
        Color topColor = layers[layers.Count - 1];
        layers.RemoveAt(layers.Count - 1);
        UpdateVisuals();
        return topColor;
    }

    public void UpdateVisuals()
    {
        var visual = GetComponent<WaterShaderController>();
        if (visual != null) visual.RefreshVisuals();
    }

    public bool IsSolved()
    {
        if (layers.Count == 0) return true;
        if (layers.Count != maxLayers) return false;
        Color first = layers[0];
        foreach (var c in layers) if (c != first) return false;
        return true;
    }

    public Color GetTopColor() => layers.Count > 0 ? layers[layers.Count - 1] : Color.clear;
    public bool CanExtract() => layers.Count > 0;
    public bool CanFill(Color c) => layers.Count == 0 || (layers.Count < maxLayers && GetTopColor() == c);
}
