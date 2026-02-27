using UnityEngine;
using UnityEngine.UI; // برای کار با متن و دکمه‌ها
using TMPro; // اگر از TextMeshPro استفاده می‌کنی

public class UIManager : MonoBehaviour
{
    public Text levelText; // نمایش شماره مرحله در بالای صفحه

    void Start()
    {
        UpdateLevelUI();
    }

    public void UpdateLevelUI()
    {
        // گرفتن شماره مرحله از فایل LevelSystem که قبلاً ساختیم
        if (LevelSystem.Instance != null)
        {
            levelText.text = "LEVEL " + LevelSystem.Instance.currentLevel;
        }
    }

    // این متد را به دکمه Restart در بازی وصل می‌کنیم
    public void OnRestartClick()
    {
        // بارگذاری مجدد مرحله فعلی
        LevelSystem.Instance.LoadCurrentLevel();
    }
}
