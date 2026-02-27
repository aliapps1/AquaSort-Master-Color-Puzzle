using UnityEngine;

public class AdManager : MonoBehaviour
{
    public static AdManager Instance;

    void Awake()
    {
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    // این متد را وقتی مرحله تمام شد صدا می‌زنیم
    public void ShowInterstitialAd()
    {
        Debug.Log("Displaying Interstitial Ad... (Revenue Generating)");
        // در اینجا کد اصلی Google AdMob قرار می‌گیرد
    }

    public void ShowRewardedAd()
    {
        Debug.Log("Showing Video Ad for Extra Life/Bottle...");
        // پاداش به کاربر بعد از دیدن ویدیو
    }
}
