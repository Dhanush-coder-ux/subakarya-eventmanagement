import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Color(0xFFFFFCF6),
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const SubakaryaApp());
}

class SubakaryaApp extends StatelessWidget {
  const SubakaryaApp({super.key});

  static const Color wineRed = Color(0xFF7F011F);
  static const Color lightSand = Color(0xFFF5EBD0);
  static const Color surfaceWarm = Color(0xFFFFFCF6);
  static const Color charcoal = Color(0xFF282326);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Subakarya',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: wineRed,
          primary: wineRed,
          surface: surfaceWarm,
          onPrimary: Colors.white,
          onSurface: charcoal,
        ),
        scaffoldBackgroundColor: surfaceWarm,
        useMaterial3: true,
      ),
      home: const SubakaryaWebViewScreen(),
    );
  }
}

class SubakaryaWebViewScreen extends StatefulWidget {
  const SubakaryaWebViewScreen({super.key});

  @override
  State<SubakaryaWebViewScreen> createState() => _SubakaryaWebViewScreenState();
}

class _SubakaryaWebViewScreenState extends State<SubakaryaWebViewScreen> {
  static const String appUrl = 'https://subakarya-eventmanagement.vercel.app/';

  late final WebViewController _controller;
  bool _isLoading = true;
  double _loadingProgress = 0.0;
  bool _hasError = false;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _initWebViewController();
  }

  void _initWebViewController() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(SubakaryaApp.surfaceWarm)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            if (mounted) {
              setState(() {
                _loadingProgress = progress / 100.0;
              });
            }
          },
          onPageStarted: (String url) {
            if (mounted) {
              setState(() {
                _isLoading = true;
                _hasError = false;
              });
            }
          },
          onPageFinished: (String url) {
            if (mounted) {
              setState(() {
                _isLoading = false;
              });
            }
          },
          onWebResourceError: (WebResourceError error) {
            // Only flag main frame failures as full-page error
            if (error.isForMainFrame ?? true) {
              if (mounted) {
                setState(() {
                  _isLoading = false;
                  _hasError = true;
                  _errorMessage = error.description;
                });
              }
            }
          },
          onNavigationRequest: (NavigationRequest request) {
            final uri = Uri.tryParse(request.url);
            if (uri != null) {
              // External links: phone, mail, whatsapp, social media
              if (uri.scheme == 'tel' ||
                  uri.scheme == 'mailto' ||
                  uri.scheme == 'sms') {
                _launchExternalUrl(request.url);
                return NavigationDecision.prevent;
              }
              // Allow intra-domain and internal routing
              if (uri.host.contains('vercel.app') ||
                  uri.host.contains('subakarya') ||
                  uri.host.isEmpty) {
                return NavigationDecision.navigate;
              }
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(appUrl));
  }

  Future<void> _launchExternalUrl(String url) async {
    final uri = Uri.tryParse(url);
    if (uri != null && await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _retryLoading() {
    setState(() {
      _hasError = false;
      _isLoading = true;
      _loadingProgress = 0.0;
    });
    _controller.loadRequest(Uri.parse(appUrl));
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        if (await _controller.canGoBack()) {
          await _controller.goBack();
        } else {
          if (context.mounted) {
            SystemNavigator.pop();
          }
        }
      },
      child: Scaffold(
        body: SafeArea(
          child: Stack(
            children: [
              // 1. WebView Component
              if (!_hasError) WebViewWidget(controller: _controller),

              // 2. Linear Loading Bar (Top)
              if (_isLoading && !_hasError)
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  child: LinearProgressIndicator(
                    value: _loadingProgress > 0 ? _loadingProgress : null,
                    backgroundColor: SubakaryaApp.lightSand,
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      SubakaryaApp.wineRed,
                    ),
                    minHeight: 3.5,
                  ),
                ),

              // 3. Branded Splash Loading Screen
              if (_isLoading && _loadingProgress < 0.4 && !_hasError)
                Container(
                  color: SubakaryaApp.surfaceWarm,
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 88,
                          height: 88,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color: SubakaryaApp.charcoal.withValues(
                                  alpha: 0.08,
                                ),
                                blurRadius: 20,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          padding: const EdgeInsets.all(12),
                          child: Image.asset(
                            'assets/subakarya-logo.png',
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                decoration: BoxDecoration(
                                  color: SubakaryaApp.wineRed,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: const Center(
                                  child: Text(
                                    'S',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 32,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 20),
                        const Text(
                          'SUBAKARYA',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 2.5,
                            color: SubakaryaApp.charcoal,
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'EVENTS MADE EFFORTLESS',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 2.0,
                            color: SubakaryaApp.wineRed,
                          ),
                        ),
                        const SizedBox(height: 32),
                        const SizedBox(
                          width: 28,
                          height: 28,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.8,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              SubakaryaApp.wineRed,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // 4. Branded Error Screen with Retry
              if (_hasError)
                Container(
                  color: SubakaryaApp.surfaceWarm,
                  padding: const EdgeInsets.symmetric(horizontal: 28),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 72,
                          height: 72,
                          decoration: BoxDecoration(
                            color: SubakaryaApp.lightSand,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.wifi_off_rounded,
                            size: 34,
                            color: SubakaryaApp.wineRed,
                          ),
                        ),
                        const SizedBox(height: 22),
                        const Text(
                          'Connection Problem',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: SubakaryaApp.charcoal,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _errorMessage.isNotEmpty
                              ? 'Unable to reach Subakarya servers. Please verify your internet connection and try again.'
                              : 'The Subakarya website could not be loaded at this time.',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13,
                            color: Color(0xFF77716D),
                            height: 1.45,
                          ),
                        ),
                        const SizedBox(height: 28),
                        ElevatedButton.icon(
                          onPressed: _retryLoading,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: SubakaryaApp.wineRed,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 28,
                              vertical: 14,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            elevation: 0,
                          ),
                          icon: const Icon(Icons.refresh_rounded, size: 18),
                          label: const Text(
                            'Retry Connection',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
