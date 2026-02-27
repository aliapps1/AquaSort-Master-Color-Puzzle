using UnityEngine;
using System.Collections.Generic;

public class WaterShaderController : MonoBehaviour
{
    private BottleController bottle;
    public GameObject waterLayerPrefab; // اسپرایتی که در یونیتی ساخته‌ای
    private List<GameObject> activeLayers = new List<GameObject>();

    public void RefreshVisuals()
    {
        if (bottle == null) bottle = GetComponent<BottleController>();

        foreach (var layer in activeLayers) Destroy(layer);
        activeLayers.Clear();

        for (int i = 0; i < bottle.layers.Count; i++)
        {
            GameObject newLayer = Instantiate(waterLayerPrefab, transform);
            float yOffset = i * 0.45f; // فاصله لایه‌ها
            newLayer.transform.localPosition = new Vector3(0, yOffset - 0.8f, 0);
            newLayer.GetComponent<SpriteRenderer>().color = bottle.layers[i];
            activeLayers.Add(newLayer);
        }
    }
}
