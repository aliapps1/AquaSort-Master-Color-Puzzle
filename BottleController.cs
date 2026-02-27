using System.Collections.Generic;
using UnityEngine;

public class BottleController : MonoBehaviour
{
    [Header("Bottle Logic")]
    public List<Color> layers = new List<Color>();
    public int maxLayers = 4;

    [Header("Components")]
    private WaterShaderController visualController;
    private VictoryEffect victoryEffect;
    private BottleAnimation bottleAnim;

    void Awake()
    {
        visualController = GetComponent<WaterShaderController>();
        victoryEffect = GetComponent<VictoryEffect>();
        bottleAnim = GetComponent<BottleAnimation>();
    }

    void Start()
    {
        UpdateVisuals();
    }

    public Color GetTopColor()
    {
        if (layers.Count > 0) return layers[layers.Count - 1];
        return Color.clear;
    }

    public bool CanExtract() => layers.Count > 0;

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
            
            // چک کردن خودکار برای افکت پیروزی
            if (IsSolved() && layers.Count == maxLayers)
            {
                if (victoryEffect != null) victoryEffect.PlayWinEffect();
            }
        }
    }

    public void UpdateVisuals()
    {
        if (visualController != null) visualController.RefreshVisuals();
    }

    public bool IsSolved()
    {
        if (layers.Count == 0) return true;
        if (layers.Count != maxLayers) return false;
        Color firstColor = layers[0];
        foreach (var c in layers) if (c != firstColor) return false;
        return true;
    }

    // متد کمکی برای انیمیشن انتخاب
    public void SetSelected(bool selected)
    {
        if (bottleAnim != null) bottleAnim.LiftBottle(selected);
    }
}
