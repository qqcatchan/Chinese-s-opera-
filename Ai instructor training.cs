using UnityEngine;
using System.Collections.Generic;

/// <summary>
/// AI Immersive Trainer System
/// 支援場景轉換、角色互換、音樂同步表演、分數計算、自動化除錯
/// 可擴展至粵劇、語言、運動、健康課程
/// </summary>
public class AIImmersiveTrainer : MonoBehaviour
{
    [System.Serializable]
    public class RoleCharacter
    {
        public string roleName;
        public GameObject character;
        public Animator animator;
        public AudioSource voice;
    }

    [System.Serializable]
    public class TrainingModule
    {
        public string moduleName;
        public string description;
        public List<string> exercises;
        public List<string> feedbackTypes;
    }

    public List<RoleCharacter> roleCharacters;
    public List<AudioSource> musicTracks;
    public List<GameObject> scenes;
    public List<TrainingModule> modules;

    public int currentSceneIndex = 0;
    public int currentRoleIndex = 0;
    public int currentTrackIndex = 0;
    public int currentModuleIndex = 0;

    void Start()
    {
        LoadModules();
        LoadScene(0);
        LoadRole(0);
        PlayTrack(0);
        SwitchModule(0);
    }

    // ===== 場景管理 =====
    public void LoadScene(int index)
    {
        foreach (var scene in scenes) scene.SetActive(false);
        currentSceneIndex = index;
        scenes[currentSceneIndex].SetActive(true);
        AIErrorAdvisor.CheckScene(scenes[currentSceneIndex].name);
        Debug.Log("場景切換到：" + scenes[currentSceneIndex].name);
    }

    // ===== 角色管理 =====
    public void LoadRole(int index)
    {
        foreach (var rc in roleCharacters) rc.character.SetActive(false);
        currentRoleIndex = index;
        roleCharacters[currentRoleIndex].character.SetActive(true);
        AIErrorAdvisor.CheckAnimator(roleCharacters[currentRoleIndex].animator, roleCharacters[currentRoleIndex].roleName);
        Debug.Log("角色切換到：" + roleCharacters[currentRoleIndex].roleName);
    }

    // ===== 音樂管理 =====
    public void PlayTrack(int index)
    {
        foreach (var track in musicTracks) track.Stop();
        currentTrackIndex = index;
        musicTracks[currentTrackIndex].Play();
        AIErrorAdvisor.CheckAudio(musicTracks[currentTrackIndex], musicTracks[currentTrackIndex].clip.name);
        Debug.Log("播放音樂：" + musicTracks[currentTrackIndex].clip.name);
    }

    // ===== 課程模組管理 =====
    void LoadModules()
    {
        modules = new List<TrainingModule>
        {
            new TrainingModule {
                moduleName = "粵劇課程",
                description = "學習唱腔、舞步、武打",
                exercises = new List<string>{"唱段練習","舞步練習","武打練習"},
                feedbackTypes = new List<string>{"LipSyncError","GestureError","StepError"}
            },
            new TrainingModule {
                moduleName = "語言課程",
                description = "多語言發音練習",
                exercises = new List<string>{"發音糾錯","口型同步","語調練習"},
                feedbackTypes = new List<string>{"PronunciationError","ToneError"}
            },
            new TrainingModule {
                moduleName = "運動課程",
                description = "姿勢與動作訓練",
                exercises = new List<string>{"舞蹈動作","健身動作","武打動作"},
                feedbackTypes = new List<string>{"PostureError","BalanceError"}
            },
            new TrainingModule {
                moduleName = "健康課程",
                description = "心率與呼吸管理",
                exercises = new List<string>{"呼吸練習","心率監測","放鬆訓練"},
                feedbackTypes = new List<string>{"OverExertion","BreathingError"}
            }
        };
    }

    public void SwitchModule(int index)
    {
        currentModuleIndex = index;
        Debug.Log("切換到課程模組：" + modules[currentModuleIndex].moduleName);
    }

    // ===== 分數計算演算法 =====
    public void CalculateScore(string exercise, float accuracy)
    {
        AIErrorAdvisor.CheckScore(accuracy, exercise);
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.S))
        {
            int nextScene = (currentSceneIndex + 1) % scenes.Count;
            LoadScene(nextScene);
        }

        if (Input.GetKeyDown(KeyCode.Tab))
        {
            int nextRole = (currentRoleIndex + 1) % roleCharacters.Count;
            LoadRole(nextRole);
        }

        if (Input.GetKeyDown(KeyCode.N))
        {
            int nextTrack = (currentTrackIndex + 1) % musicTracks.Count;
            PlayTrack(nextTrack);
        }

        foreach (RoleCharacter rc in roleCharacters)
        {
            if (rc.voice != null && rc.voice.isPlaying)
            {
                float mouthValue = Mathf.Abs(Mathf.Sin(Time.time * 5f));
                rc.animator.SetFloat("MouthOpen", mouthValue);
                rc.animator.SetTrigger("DanceStep");
            }
        }
    }
}
