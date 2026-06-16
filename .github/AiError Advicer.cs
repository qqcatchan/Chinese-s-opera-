using UnityEngine;

public class AIErrorAdvisor : MonoBehaviour
{
    public static void CheckAnimator(Animator animator, string name)
    {
        if (animator == null)
            Debug.LogError($"Animator for {name} 未綁定！");
    }

    public static void CheckScene(string sceneName)
    {
        if (!Application.CanStreamedLevelBeLoaded(sceneName))
            Debug.LogError($"場景 {sceneName} 未找到！");
    }

    public static void CheckAudio(AudioSource audio, string trackName)
    {
        if (audio == null)
            Debug.LogError($"音樂 {trackName} 未綁定！");
        else if (!audio.isPlaying)
            Debug.LogWarning($"音樂 {trackName} 未播放！");
    }

    public static void CheckScore(float accuracy, string exercise)
    {
        if (accuracy < 0 || accuracy > 1)
            Debug.LogError($"分數計算錯誤：練習 {exercise} 準確度超出範圍 (0-1)。");
        else
        {
            int score = Mathf.RoundToInt(accuracy * 100);
            Debug.Log($"分數計算正常：練習 {exercise} | 準確度 {accuracy} | 分數 {score}");
        }
    }
}
