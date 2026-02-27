using UnityEngine;

public class SettingsManager : MonoBehaviour
{
    public static SettingsManager Instance;

    // متغیرهایی برای ذخیره وضعیت تنظیمات
    public bool isSoundOn = true;
    public bool isVibrationOn = true;

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            LoadSettings(); // بارگذاری تنظیمات ذخیره شده
        }
        else
        {
            Destroy(gameObject);
        }
    }

    // تغییر وضعیت صدا
    public void ToggleSound()
    {
        isSoundOn = !isSoundOn;
        PlayerPrefs.SetInt("SoundSetting", isSoundOn ? 1 : 0);
        PlayerPrefs.Save();
    }

    // تغییر وضعیت لرزش
    public void ToggleVibration()
    {
        isVibrationOn = !isVibrationOn;
        PlayerPrefs.SetInt("VibrationSetting", isVibrationOn ? 1 : 0);
        PlayerPrefs.Save();
    }

    void LoadSettings()
    {
        isSoundOn = PlayerPrefs.GetInt("SoundSetting", 1) == 1;
        isVibrationOn = PlayerPrefs.GetInt("VibrationSetting", 1) == 1;
    }
}
